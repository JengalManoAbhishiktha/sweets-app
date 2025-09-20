import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function AddSweet() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://sweets-app.onrender.com";
  const token = localStorage.getItem("token"); // Seller JWT token

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddSweet = async () => {
    if (!name || !category || !price || !quantity || !image) {
      alert("Please fill all fields and upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/sweets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Sweet added successfully!");
      // Clear form
      setName("");
      setCategory("");
      setPrice("");
      setQuantity("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error adding sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 3,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          background: "linear-gradient(145deg, #fff8f0, #fff3e0)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#ff9800" }}>
          ➕ Add New Sweet
        </Typography>

        <TextField
          fullWidth
          label="Sweet Name"
          sx={{ mb: 3 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Category"
          sx={{ mb: 3 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          fullWidth
          type="number"
          label="Price (₹)"
          sx={{ mb: 3 }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          fullWidth
          type="number"
          label="Quantity"
          sx={{ mb: 3 }}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            mb: 3,
            borderRadius: 2,
            py: 1.5,
            color: "#ff9800",
            borderColor: "#ff9800",
            "&:hover": { borderColor: "#f57c00", backgroundColor: "#fff3e0" },
          }}
        >
          Upload Image
          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
        </Button>

        {image && (
          <Box
            component="img"
            src={URL.createObjectURL(image)}
            alt="Sweet Preview"
            sx={{ width: "100%", mb: 3, borderRadius: 2, objectFit: "cover" }}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(90deg, #ff9800, #f57c00)",
            "&:hover": { background: "linear-gradient(90deg, #f57c00, #e68900)" },
            borderRadius: 2,
            py: 1.5,
            fontWeight: "bold",
            boxShadow: "0 6px 15px rgba(245,124,0,0.4)",
          }}
          onClick={handleAddSweet}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Sweet"}
        </Button>
      </Paper>
    </Box>
  );
}

export default AddSweet;
