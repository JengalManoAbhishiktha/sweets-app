import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function SellerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #F47C20, #FFB74D)", // same orange theme
        mb: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/add-sweet"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            letterSpacing: "1px",
            fontSize: "1.2rem",
          }}
        >
          🛒 Seller Panel
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: { xs: 1, sm: 0 } }}>
          <Button
            component={Link}
            to="/add-sweet"
            sx={{
              color: "white",
              fontWeight: 500,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              borderRadius: 2,
            }}
          >
            Add Sweet
          </Button>

          <Button
            component={Link}
            to="/seller-dashboard"
            sx={{
              color: "white",
              fontWeight: 500,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              borderRadius: 2,
            }}
          >
            Edit Sweet
          </Button>

          

          {/* Logout */}
          <Button
            onClick={handleLogout}
            sx={{
              color: "white",
              fontWeight: 700,
              backgroundColor: "#d84315", // slightly darker orange for logout
              "&:hover": { backgroundColor: "#bf360c" },
              borderRadius: 2,
              ml: 1,
              px: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SellerNavbar;
