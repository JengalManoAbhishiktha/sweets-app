import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #ff9800, #ff5722)",
        mb: 4,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Sweet Shop
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/dashboard" sx={{ color: "white" }}>
            Dashboard
          </Button>
          <Button onClick={handleLogout} sx={{ color: "white" }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default UserNavbar;
