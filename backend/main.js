// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.secretKey || 'replace_this_secret';
const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [process.env.origin || "http://localhost:5173"],
  credentials: true
}));

// ---------------- MONGODB ----------------
if (!process.env.mongoconnect) {
  console.error("Missing MongoDB connection string in .env (mongoconnect).");
  process.exit(1);
}

mongoose.connect(process.env.mongoconnect)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ---------------- MODELS ----------------
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, index: true },
  password: String,
  role: { type: String, enum: ['customer', 'seller'], default: 'customer' }
});
const User = mongoose.model('User', userSchema);

const sweetSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  imageKey: String,
  createdAt: { type: Date, default: Date.now }
});
const Sweet = mongoose.model('Sweet', sweetSchema);

// ---------------- GOOGLE LOGIN ----------------
app.post('/auth/google', async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ error: "TokenId required" });

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username: name, password: "", role: "customer" });
      await user.save();
    }

    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '2h' });

    res.json({ message: "Google login successful", token, role: user.role, name, picture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
});

// ---------------- MULTER ----------------
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ---------------- AWS S3 ----------------
const s3Client = new S3Client({
  region: process.env.bucket_region,
  credentials: {
    accessKeyId: process.env.access_key,
    secretAccessKey: process.env.secret_aws
  }
});

async function uploadBufferToS3(buffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.bucket_name,
    Key: key,
    Body: buffer,
    ContentType: contentType
  });
  await s3Client.send(command);
  return key;
}

async function getSignedUrlForKey(key, expiresInSec = 300) {
  if (!key) return null;
  const command = new GetObjectCommand({ Bucket: process.env.bucket_name, Key: key });
  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSec });
}

// ---------------- AUTH MIDDLEWARE ----------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    req.user = jwt.verify(token, secretKey);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    next();
  };
}

// ---------------- AUTH ROUTES ----------------
app.post('/signup', async (req, res) => {
  try {
    let { email, password, username, role } = req.body;
    if (!email || !password || !username) return res.status(400).json({ error: "All fields required" });

    email = email.toLowerCase().trim();
    if (await User.findOne({ email })) return res.status(409).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, role: role || 'customer' });
    await user.save();

    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '2h' });
    res.json({ message: "Registered successfully", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '2h' });
    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ---------------- SWEET ROUTES ----------------
const sweetRouter = express.Router();

// Public routes
sweetRouter.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    const sweetsWithImages = await Promise.all(sweets.map(async s => ({
      ...s.toObject(),
      imageUrl: await getSignedUrlForKey(s.imageKey, 600)
    })));
    res.json(sweetsWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching sweets" });
  }
});

sweetRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid sweet ID" });

  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });

    const imageUrl = await getSignedUrlForKey(sweet.imageKey, 600);
    res.json({ ...sweet.toObject(), imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching sweet" });
  }
});

// Protected routes
sweetRouter.post('/:id/buy', authMiddleware, requireRole('customer'), async (req, res) => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });
    if (sweet.quantity <= 0) return res.status(400).json({ error: "Out of stock" });

    sweet.quantity -= 1;
    await sweet.save();

    const imageUrl = await getSignedUrlForKey(sweet.imageKey, 600);
    res.json({ message: "Purchased successfully", sweet: { ...sweet.toObject(), imageUrl } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error purchasing sweet" });
  }
});

sweetRouter.post('/', authMiddleware, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || !price || !quantity) return res.status(400).json({ error: "All fields required" });

    let imageKey = null;
    if (req.file) {
      imageKey = `sweets/${Date.now()}_${req.file.originalname}`;
      await uploadBufferToS3(req.file.buffer, imageKey, req.file.mimetype);
    }

    const sweet = new Sweet({ name, category, price: Number(price), quantity: Number(quantity), imageKey });
    await sweet.save();
    res.json({ message: "Sweet added", sweet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding sweet" });
  }
});

sweetRouter.put('/:id', authMiddleware, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });

    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price) sweet.price = Number(price);
    if (quantity) sweet.quantity = Number(quantity);

    if (req.file) {
      if (sweet.imageKey) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.bucket_name,
          Key: sweet.imageKey
        }));
      }
      const imageKey = `sweets/${Date.now()}_${req.file.originalname}`;
      await uploadBufferToS3(req.file.buffer, imageKey, req.file.mimetype);
      sweet.imageKey = imageKey;
    }

    await sweet.save();
    const imageUrl = await getSignedUrlForKey(sweet.imageKey, 600);
    res.json({ message: "Sweet updated successfully", sweet: { ...sweet.toObject(), imageUrl } });
  } catch (err) {
    console.error("Error updating sweet:", err);
    res.status(500).json({ error: "Server error while updating sweet" });
  }
});

app.use('/sweets', sweetRouter);

// ---------------- ROOT ----------------
app.get('/', (req, res) => res.send('SweetShop Backend is running!'));

// ---------------- START SERVER ----------------
app.listen(port, () => console.log(`Server running on port ${port}`));
