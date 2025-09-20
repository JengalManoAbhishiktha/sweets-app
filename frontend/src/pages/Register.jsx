// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Typography, IconButton, InputAdornment } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSignup = async () => {
    if (!email || !password || !username) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        username,
      });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential; // Google JWT
      const res = await axios.post(`${API_URL}/auth/google`, { tokenId });
      const { token, role, name, picture } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", name);
      localStorage.setItem("picture", picture);
      alert("Google login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Google login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#fffaf3",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          width: 400,
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          color: "#333333",
          textAlign: "left",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          style={{ fontWeight: "bold" }}
        >
          Create Account
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Password Requirements:
        </Typography>
        <ul style={{ fontSize: "14px", marginBottom: "20px" }}>
          <li>An uppercase character</li>
          <li>A numeric character</li>
          <li>An alphabetic character</li>
          <li>A minimum of 8 characters</li>
          <li>A lowercase character</li>
          <li>A special character</li>
        </ul>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email Address"
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
          <TextField
            label="Verify New Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 1 }}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
              position: "relative",
            }}
          >
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
            <Typography
              sx={{
                mx: 2,
                color: "#555",
                fontWeight: "600",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          </Box>

          {/* Custom Google Button */}
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => alert("Google Login Failed")}
            useOneTap
            render={({ onClick }) => (
              <Button
                onClick={onClick}
                variant="outlined"
                fullWidth
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#4285F4",
                  color: "#555",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  textTransform: "none",
                  padding: "10px 0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#f8f8f8",
                    borderColor: "#4285F4",
                  },
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google"
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                Continue with Google
              </Button>
            )}
          />
        </Box>
      </div>
    </div>
  );
}

export default Signup;
