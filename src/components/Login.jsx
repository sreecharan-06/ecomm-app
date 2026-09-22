import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./LoginStyles.css";
import { CartContext } from "../context/CartContext";

const readUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

function Login() {
  const [username, setUsername] = useState("charan");
  const [password, setPassword] = useState("12345");
  const navigate = useNavigate();
  const { showToast } = useContext(CartContext) || {};

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "admin");
      if (showToast) showToast("Welcome back, Administrator!", "success");
      navigate("/admin");
    } else if (username === "charan" && password === "12345") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("role", "user");
      if (showToast) showToast(`Welcome back, ${username}!`, "success");
      navigate("/user");
    } else {
      const users = readUsers();
      const matched = users.find(
        (user) => user.username === username && user.password === password
      );
      if (matched) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", matched.username);
        localStorage.setItem("role", "user");
        if (showToast) showToast(`Welcome back, ${matched.username}!`, "success");
        navigate("/user");
        return;
      }
      if (showToast) {
        showToast("Invalid Username or Password.", "warning");
      } else {
        alert("Invalid Username or Password");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername("");
    setPassword("");
    if (showToast) showToast("Signed out successfully.", "info");
    navigate("/");
  };

  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    if (showToast) showToast(`Loaded demo credentials for: ${user}`, "info");
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const storedUsername = localStorage.getItem("username");

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          {!isLoggedIn ? (
            <>
              <div className="badge badge-primary" style={{ display: "block", textAlign: "center", width: "fit-content", margin: "0 auto 10px" }}>
                Campus SSO & Portal
              </div>
              <h1 className="login-title">Sign In to Shop</h1>
              <p className="login-subtitle">Access student perks, track orders, and manage cart</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="login-form"
              >
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <button type="submit" className="login-btn">
                  Sign In →
                </button>
              </form>

              {/* Demo Credentials Helper */}
              <div className="demo-auth-box">
                <span>⚡ Quick-Fill Demo Logins:</span>
                <div className="demo-btn-group">
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => fillCredentials("charan", "12345")}
                  >
                    Student (charan)
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => fillCredentials("admin", "admin123")}
                  >
                    Admin (admin)
                  </button>
                </div>
              </div>

              <p className="login-hint">
                New student? <Link to="/signup">Create Account</Link>
              </p>
            </>
          ) : (
            <div className="logout-card">
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👋</div>
              <h1 className="welcome-message">Welcome, {storedUsername}!</h1>
              <p className="logout-subtitle">You are actively logged into KL University Shop</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <Link to="/products" className="btn-primary btn-sm">
                  Browse Store →
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
