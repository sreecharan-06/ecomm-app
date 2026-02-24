import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const name = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header>
      <h1>KL University Shop</h1>
      <nav>
        {isAdminPage ? (
          <>
            <Link to="/admin">Admin Product Management</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            {!name && <Link to="/login">Login</Link>}
            {!name && <Link to="/signup">Sign Up</Link>}
            {role === "admin" && <Link to="/admin">Admin</Link>}
            {role === "user" && <Link to="/user">User</Link>}
          </>
        )}
      </nav>
      <div id="user-display">
        {name ? (
          <>
            <span style={{ marginRight: "15px" }}>Welcome, {name}!</span>
            <button 
              onClick={handleLogout} 
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Logout
            </button>
          </>
        ) : ""}
      </div>
    </header>
  );
}

export default Header;
