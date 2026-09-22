import { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";

function User() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");
  const { cart, totalCartCount = 0 } = useContext(CartContext) || {};

  useEffect(() => {
    if (!isLoggedIn || role !== "user") {
      navigate("/login");
    }
  }, [isLoggedIn, role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: "1000px", margin: "40px auto 80px", padding: "0 24px", width: "100%" }}>
        {/* User Profile Banner */}
        <div style={{ background: "rgba(19, 27, 46, 0.8)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "36px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#fff", fontWeight: 800 }}>
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: "6px" }}>
                ✓ Verified KL Student Account
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: 0 }}>
                Welcome, {username || "Student"}!
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                Active campus membership with hostel delivery privileges and student subsidies.
              </p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button 
                onClick={handleLogout}
                className="btn-secondary btn-sm"
                style={{ color: "#fb7185", borderColor: "rgba(244,63,94,0.3)" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(19, 27, 46, 0.6)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🛒</div>
            <h4 style={{ color: "#fff", fontSize: "17px", marginBottom: "4px" }}>Cart Items</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "14px" }}>
              You have <strong>{totalCartCount}</strong> item(s) ready in your shopping bag.
            </p>
            <Link to="/cart" className="btn-primary btn-sm" style={{ width: "100%" }}>
              View Cart ({totalCartCount})
            </Link>
          </div>

          <div style={{ background: "rgba(19, 27, 46, 0.6)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏷️</div>
            <h4 style={{ color: "#fff", fontSize: "17px", marginBottom: "4px" }}>Student Discount</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "14px" }}>
              Status: <span className="badge badge-amber">Active 15% - 25% Off</span> on campus essentials.
            </p>
            <Link to="/products" className="btn-secondary btn-sm" style={{ width: "100%" }}>
              Explore Products →
            </Link>
          </div>

          <div style={{ background: "rgba(19, 27, 46, 0.6)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🚀</div>
            <h4 style={{ color: "#fff", fontSize: "17px", marginBottom: "4px" }}>Hostel Delivery</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "14px" }}>
              Available 7 days a week: 8:00 AM – 10:00 PM for all registered dormitories.
            </p>
            <span style={{ fontSize: "12px", color: "var(--accent-emerald)", fontWeight: 600 }}>
              ✓ Free Campus Shipping Enabled
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default User;
