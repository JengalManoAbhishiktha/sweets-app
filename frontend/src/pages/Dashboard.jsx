import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SweetCard from "../components/SweetCard";
import axios from "axios";

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("token"); // optional if auth

  // Fetch sweets from backend
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/sweets`);
        setSweets(res.data);
      } catch (err) {
        console.error("Error fetching sweets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  // Handle Buy action
  const handleBuy = async (sweet) => {
    try {
      const res = await axios.post(
        `${API_URL}/sweets/${sweet._id}/buy`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update frontend state
      setSweets((prev) =>
        prev.map((s) => (s._id === sweet._id ? res.data.sweet : s))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  // Filter sweets
  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || sweet.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(90deg, #ff9800, #ffb74d)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Sweet Shop
        </Typography>
        <Typography variant="subtitle1">
          Explore and enjoy your favorite sweets!
        </Typography>
      </Paper>

      {/* Search & Filter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Indian">Indian</MenuItem>
          <MenuItem value="Bengali">Bengali</MenuItem>
          <MenuItem value="Dry Fruit">Dry Fruit</MenuItem>
        </TextField>
      </Box>

      {/* Loading / Results */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress size={60} thickness={5} />
        </Box>
      ) : filteredSweets.length === 0 ? (
        <Typography align="center" variant="h6" color="text.secondary">
          No sweets found. Try another search!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredSweets.map((sweet) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={sweet._id}>
              <SweetCard sweet={sweet} API_URL={API_URL} onBuy={handleBuy} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;
