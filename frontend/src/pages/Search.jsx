import { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import SweetCard from "../components/SweetCard";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Replace with API call later
    const sweets = [
      { id: 1, name: "Gulab Jamun", category: "Indian", price: 20, quantity: 10 },
      { id: 2, name: "Rasgulla", category: "Bengali", price: 25, quantity: 0 },
    ];
    setResults(sweets.filter(s => s.name.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField 
          label="Search by name" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>

      <Grid container spacing={3}>
        {results.map(sweet => (
          <Grid item xs={12} sm={6} md={4} key={sweet.id}>
            <SweetCard sweet={sweet} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Search;
