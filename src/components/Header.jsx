import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Header() {
  const name = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { totalCartCount = 0 } = useContext(CartContext) || {};
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header>
      <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
        <div className="brand-icon">🛍️</div>
        <h1 className="brand-title">KL University <span>Shop</span></h1>
      </Link>

      <button 
        className="mobile-nav-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <nav className={mobileMenuOpen ? "mobile-active" : ""}>
        {isAdminPage ? (
          <>
            <Link to="/admin" className={isActive("/admin")} onClick={() => setMobileMenuOpen(false)}>
              Admin Product Management
            </Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Storefront</Link>
          </>
        ) : (
          <>
            <Link to="/" className={isActive("/")} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className={isActive("/products")} onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/cart" className={`cart-link ${isActive("/cart")}`} onClick={() => setMobileMenuOpen(false)}>
              Cart
              {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
            </Link>
            {!name && (
              <>
                <Link to="/login" className={isActive("/login")} onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className={isActive("/signup")} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
            {role === "admin" && (
              <Link to="/admin" className={isActive("/admin")} onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
            {role === "user" && (
              <Link to="/user" className={isActive("/user")} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            )}
          </>
        )}
      </nav>

      <div id="user-display">
        {name ? (
          <div className="user-pill">
            <span className="user-dot"></span>
            <span>Hi, {name}</span>
            <button 
              onClick={handleLogout} 
              style={{
                background: "rgba(244, 63, 94, 0.2)",
                color: "#fb7185",
                border: "1px solid rgba(244, 63, 94, 0.4)",
                padding: "4px 10px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "12px",
                marginLeft: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.background = "#f43f5e"}
              onMouseOut={(e) => e.target.style.background = "rgba(244, 63, 94, 0.2)"}
            >
              Logout
            </button>
          </div>
        ) : ""}
      </div>
    </header>
  );
}

export default Header;
