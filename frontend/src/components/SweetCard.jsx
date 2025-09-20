import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import axios from "axios";

function SweetCard({ sweet, API_URL, onBuy }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      {sweet.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={sweet.imageUrl}
          alt={sweet.name}
        />
      )}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {sweet.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {sweet.category}
        </Typography>
        <Typography variant="body1" color="primary">
          Price: ₹{sweet.price}
        </Typography>
        <Typography
          variant="body2"
          color={sweet.quantity > 0 ? "green" : "red"}
        >
          {sweet.quantity > 0 ? `In Stock: ${sweet.quantity}` : "Out of Stock"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          disabled={sweet.quantity === 0}
          onClick={() => onBuy(sweet)}
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  );
}

export default SweetCard;
