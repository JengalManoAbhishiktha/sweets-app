import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffe0b2, #ffcc80)",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "6rem", sm: "8rem" },
          color: "#f57c00",
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          color: "#5d4037",
          mb: 4,
        }}
      >
        Oops! The page you are looking for does not exist.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          background: "linear-gradient(90deg, #f57c00, #ef6c00)",
          color: "white",
          fontWeight: "bold",
          px: 4,
          py: 1.5,
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(245,124,0,0.4)",
          "&:hover": {
            background: "linear-gradient(90deg, #ef6c00, #e65100)",
          },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}

export default NotFound;
