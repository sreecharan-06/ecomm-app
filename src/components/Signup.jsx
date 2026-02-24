import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./LoginStyles.css";

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

  const handleSignup = (e) => {
    e.preventDefault();
    const name = username.trim();

    if (!name || !password) {
      alert("Username and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (name.toLowerCase() === "admin") {
      alert("This username is reserved.");
      return;
    }

    const users = readUsers();
    const exists = users.some((user) => user.username === name);
    if (exists) {
      alert("Username already exists.");
      return;
    }

    const nextUsers = [...users, { username: name, password, role: "user" }];
    localStorage.setItem("users", JSON.stringify(nextUsers));
    alert("Signup successful. Please login.");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Sign up as a user</p>
          <form onSubmit={handleSignup} className="login-form">
            <div className="form-group">
              <label htmlFor="signup-username" className="form-label">Username</label>
              <input
                id="signup-username"
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Choose password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
          <p className="login-hint">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
