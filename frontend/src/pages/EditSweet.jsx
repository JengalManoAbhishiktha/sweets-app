// src/pages/EditSweet.jsx
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function EditSweet({ sweetData }) {
  const navigate = useNavigate();
  const [sweet, setSweet] = useState({
    name: sweetData.name || "",
    category: sweetData.category || "",
    price: sweetData.price || "",
    quantity: sweetData.quantity || ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(sweetData.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const handleChange = (e) => setSweet({ ...sweet, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateSweet = async () => {
    if (!sweet.name || !sweet.category || !sweet.price || !sweet.quantity) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", sweet.name);
    formData.append("category", sweet.category);
    formData.append("price", sweet.price);
    formData.append("quantity", sweet.quantity);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await axios.put(`${API_URL}/sweets/${sweetData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Sweet updated successfully!");
      navigate("/seller-dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #ffe0e0, #ffcdd2)" }}>
      <Paper elevation={10} sx={{ p: 5, borderRadius: 3, maxWidth: 500, width: "100%", textAlign: "center", background: "linear-gradient(145deg, #fff1f2, #ffe0e0)" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#e91e63" }}>✏️ Edit Sweet</Typography>

        <TextField fullWidth label="Sweet Name" name="name" sx={{ mb: 3 }} value={sweet.name} onChange={handleChange} />
        <TextField fullWidth label="Category" name="category" sx={{ mb: 3 }} value={sweet.category} onChange={handleChange} />
        <TextField fullWidth type="number" label="Price (₹)" name="price" sx={{ mb: 3 }} value={sweet.price} onChange={handleChange} />
        <TextField fullWidth type="number" label="Quantity" name="quantity" sx={{ mb: 3 }} value={sweet.quantity} onChange={handleChange} />

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 3, borderRadius: 2, py: 1.5, color: "#e91e63", borderColor: "#e91e63", "&:hover": { borderColor: "#d81b60", backgroundColor: "#ffe0e0" } }}>
          Upload New Image
          <input type="file" hidden onChange={handleImageChange} accept="image/*" />
        </Button>

        {preview && <Box component="img" src={preview} alt="Sweet Preview" sx={{ width: "100%", mb: 4, borderRadius: 2, objectFit: "cover" }} />}

        <Button variant="contained" fullWidth sx={{ background: "linear-gradient(90deg, #e91e63, #d81b60)", "&:hover": { background: "linear-gradient(90deg, #d81b60, #c2185b)" }, borderRadius: 2, py: 1.5, fontWeight: "bold", boxShadow: "0 6px 15px rgba(233,30,99,0.4)" }} onClick={handleUpdateSweet} disabled={loading}>
          {loading ? "Updating..." : "Update Sweet"}
        </Button>
      </Paper>
    </Box>
  );
}

export default EditSweet;
