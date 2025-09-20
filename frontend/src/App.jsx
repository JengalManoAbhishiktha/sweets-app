import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Search from "./pages/Search.jsx";
import AddSweet from "./pages/AddSweet.jsx";
import EditSweetWrapper from "./pages/EditSweetWrapper.jsx"; // Wrapper to handle sweetData
import SellerDashboard from "./pages/SellerDashboard.jsx";   // New seller dashboard
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";          // Public Navbar
import UserNavbar from "./components/UserNavbar.jsx";  // User Navbar
import SellerNavbar from "./components/SellerNavbar.jsx"; // Seller Navbar
import SellerLogin from "./pages/SellerLogin.jsx";

function Layout() {
  const location = useLocation();

  // Decide which navbar to show
  let NavbarComponent = Navbar; // default = public
  if (["/dashboard", "/search"].includes(location.pathname)) {
    NavbarComponent = UserNavbar;
  } else if (
    ["/add-sweet", "/edit-sweet", "/seller-dashboard"].some((path) =>
      location.pathname.startsWith(path)
    )
  ) {
    NavbarComponent = SellerNavbar;
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#eeeeee",
        boxSizing: "border-box",
      }}
    >
      <NavbarComponent />

      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sellerlogin" element={<SellerLogin />} />     

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />

        {/* Seller Pages */}
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/add-sweet" element={<AddSweet />} />
        <Route path="/edit-sweet" element={<EditSweetWrapper />} /> {/* Pass sweetData via state */}

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
