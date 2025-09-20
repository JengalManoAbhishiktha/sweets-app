// SellerDashboard.jsx
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SellerDashboard() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://sweets-app.onrender.com";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await axios.get(`${API_URL}/sweets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSweets(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching sweets");
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  const handleEdit = (sweet) => {
    navigate("/edit-sweet", { state: { sweetData: sweet } });
  };

  if (loading) return <Typography align="center" mt={5}>Loading sweets...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: "#e91e63" }}>
        Seller Dashboard
      </Typography>
      <Grid container spacing={3}>
        {sweets.map((sweet) => (
          <Grid item xs={12} sm={6} md={4} key={sweet._id}>
            <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <img src={sweet.imageUrl || ""} alt={sweet.name} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />
              <Typography variant="h6">{sweet.name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Category: {sweet.category}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Price: ₹{sweet.price}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Quantity: {sweet.quantity}</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#e91e63", "&:hover": { backgroundColor: "#d81b60" } }}
                onClick={() => handleEdit(sweet)}
              >
                Edit
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SellerDashboard;
