// src/pages/EditSweetWrapper.jsx
import { useLocation, useNavigate } from "react-router-dom";
import EditSweet from "./EditSweet.jsx";
import { useEffect } from "react";

function EditSweetWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const sweetData = location.state?.sweetData;

  // Redirect if no sweetData is provided
  useEffect(() => {
    if (!sweetData) {
      alert("No sweet selected to edit!");
      navigate("/seller-dashboard");
    }
  }, [sweetData, navigate]);

  if (!sweetData) return null; // Prevent rendering if no data

  return <EditSweet sweetData={sweetData} />;
}

export default EditSweetWrapper;
