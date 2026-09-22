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

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useContext(CartContext) || {};

  const handleSignup = (e) => {
    e.preventDefault();
    const name = username.trim();

    if (!name || !password) {
      if (showToast) showToast("Username and password are required.", "warning");
      else alert("Username and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      if (showToast) showToast("Passwords do not match.", "warning");
      else alert("Passwords do not match.");
      return;
    }

    if (name.toLowerCase() === "admin") {
      if (showToast) showToast("This username is reserved.", "warning");
      else alert("This username is reserved.");
      return;
    }

    const users = readUsers();
    const exists = users.some((user) => user.username.toLowerCase() === name.toLowerCase());
    if (exists) {
      if (showToast) showToast("Username already exists. Please pick another.", "warning");
      else alert("Username already exists.");
      return;
    }

    const nextUsers = [...users, { username: name, password, role: "user" }];
    localStorage.setItem("users", JSON.stringify(nextUsers));
    if (showToast) showToast("Account created successfully! Please sign in.", "success");
    else alert("Signup successful. Please login.");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <div className="badge badge-emerald" style={{ display: "block", textAlign: "center", width: "fit-content", margin: "0 auto 10px" }}>
            New Student Registration
          </div>
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join thousands of students saving on campus essentials</p>

          <form onSubmit={handleSignup} className="login-form">
            <div className="form-group">
              <label htmlFor="signup-username" className="form-label">Username</label>
              <input
                id="signup-username"
                type="text"
                placeholder="Choose username (e.g. sreecharan)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Create Student Account →
            </button>
          </form>

          <p className="login-hint">
            Already registered? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
