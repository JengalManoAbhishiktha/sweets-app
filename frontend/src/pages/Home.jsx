/* Home.jsx */
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);

  // ---------------- PARTICLES ----------------
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // ---------------- ANIMATION VARIANTS ----------------
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
  };

  // ---------------- FETCH SWEETS FROM BACKEND ----------------
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://sweets-app.onrender.com";
        const res = await axios.get(`${API_URL}/sweets`);
        setSweets(res.data);
      } catch (err) {
        console.error("Error fetching sweets:", err);
      }
    };
    fetchSweets();
  }, []);

  return (
    <div className="container relative">
      <style>{`
        .container { min-height: 100vh; display: flex; flex-direction: column; background: #fffaf3; position: relative; overflow: hidden; font-family: 'Poppins', sans-serif; }
        .particles { position: absolute; inset: 0; z-index: 0; }

        /* Hero Section */
        .hero { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 20px 60px; background: linear-gradient(135deg, #fff0e6, #fffaf3); position: relative; z-index: 10; }
        .hero-title { font-size: 3.5rem; font-weight: 700; color: #8B0000; margin-bottom: 20px; letter-spacing: -1px; }
        .hero-text { font-size: 1.2rem; color: #444; max-width: 650px; line-height: 1.7; margin-bottom: 30px; }
        .hero-btn { background: #F47C20; color: white; padding: 14px 30px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }
        .hero-btn:hover { background: #d86615; transform: translateY(-2px); }

        .orange { color: #F47C20; }

        /* Products Section */
        .products { padding: 80px 20px; background: #ffffff; }
        .section-title { text-align: center; font-size: 2.5rem; font-weight: 700; color: #8B0000; margin-bottom: 50px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; max-width: 1150px; margin: 0 auto; }
        .product-card { background: #fff9f4; padding: 22px; border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.1); transition: all 0.3s ease; text-align: center; position: relative; overflow: hidden; }
        .product-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 12px 24px rgba(0,0,0,0.15); }
        .product-card img { width: 100%; height: 190px; object-fit: cover; border-radius: 14px; margin-bottom: 18px; transition: transform 0.4s ease; }
        .product-card:hover img { transform: scale(1.08); }
        .product-card h4 { font-size: 1.4rem; color: #8B0000; margin-bottom: 10px; font-weight: 600; }
        .product-card p { color: #555; font-size: 0.95rem; margin-bottom: 12px; line-height: 1.4; }
        .product-price { font-weight: 700; color: #F47C20; font-size: 1.2rem; margin-bottom: 15px; }

        /* Footer */
        .footer { background: #8B0000; color: white; display: flex; justify-content: center; align-items: center; padding: 25px 0; font-size: 15px; position: relative; z-index: 10; letter-spacing: 0.5px; }
      `}</style>

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "#fffaf3" } },
          particles: {
            number: { value: 35, density: { enable: true, area: 800 } },
            color: { value: ["#8B0000", "#F47C20"] },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: 1.2, outModes: { default: "out" } },
            links: { enable: true, color: "#8B0000", distance: 120, opacity: 0.25, width: 1 },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { quantity: 2 } },
          },
          retina_detect: true,
        }}
        className="particles absolute top-0 left-0 w-full h-full"
      />

      {/* Hero Section */}
      <section className="hero">
        <motion.h2 variants={heroVariants} initial="hidden" animate="visible" className="hero-title">
          Welcome to <span className="orange">SweetShop</span>
        </motion.h2>
        <motion.p variants={heroVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="hero-text">
          Indulge in a world of sweetness! Handcrafted with love, our sweets bring tradition, taste, and joy to every bite.
        </motion.p>
        <motion.button
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="hero-btn"
          onClick={() => navigate("/login")}
        >
          Explore Sweets
        </motion.button>
      </section>

      {/* Products Section */}
      <section className="products">
        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="section-title">
          Popular Sweets
        </motion.h3>
        <div className="product-grid">
          {sweets.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1/-1" }}>Loading sweets...</p>
          ) : (
            sweets.map((sweet, i) => (
              <motion.div
                key={sweet._id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover={{ scale: 1.05 }}
                className="product-card"
              >
                <img src={sweet.imageUrl || "https://via.placeholder.com/300x200"} alt={sweet.name} />
                <h4>{sweet.name}</h4>
                <p>{sweet.category}</p>
                <div className="product-price">₹{sweet.price}</div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <motion.footer variants={footerVariants} initial="hidden" whileInView="visible" className="footer">
        <p>© {new Date().getFullYear()} SweetShop. Crafted with ❤️ for sweet lovers.</p>
      </motion.footer>
    </div>
  );
}
