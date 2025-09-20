// Signin.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://sweets-app.onrender.com";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, role } = res.data;

      // Ensure only sellers can login here
      if (role !== "seller") {
        alert("Access denied: not a seller");
        setLoading(false);
        return;
      }

      // Save seller data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      alert("Seller login successful!");
      navigate("/add-sweet"); // Redirect to seller dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            width: 400,
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            textAlign: "center",
            color: "#333333"
          }}
        >
          <Typography variant="h5" gutterBottom>Seller Login</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              label="Email" 
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField 
              label="Password" 
              type={showPassword ? "text" : "password"}
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button 
              variant="contained" 
              size="large"
              sx={{ mt: 1 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Signin;
