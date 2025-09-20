/* Navbar.jsx */
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#F47C20",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand / Logo */}
      <div style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          SweetShop
        </Link>
      </div>

      {/* Links / Buttons */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            background: "white",
            color: "#F47C20",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          User Login
        </Link>

        <Link
          to="/register"
          style={{
            textDecoration: "none",
            background: "white",
            color: "#F47C20",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          Register
        </Link>

        <Link
          to="/sellerlogin"
          style={{
            textDecoration: "none",
            background: "#8B0000",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          Seller Login
        </Link>
      </div>
    </nav>
  );
}
