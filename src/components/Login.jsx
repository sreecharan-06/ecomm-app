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

function Login (){
    const [username ,setUsername] = useState("");
    const [password ,setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === "admin" && password === "admin123") {
            localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("username",username);
            localStorage.setItem("role","admin");
            navigate("/admin");
        } else if (username === "charan" && password === "12345") {
            localStorage.setItem("isLoggedIn","true");
            localStorage.setItem("username",username);
            localStorage.setItem("role","user");
            navigate("/user");
        } else {
            const users = readUsers();
            const matched = users.find(
              (user) => user.username === username && user.password === password
            );
            if (matched) {
                localStorage.setItem("isLoggedIn","true");
                localStorage.setItem("username",matched.username);
                localStorage.setItem("role","user");
                navigate("/user");
                return;
            }
            alert ("Invalid Username or Password");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setUsername("");
        setPassword("");
        navigate("/");
    };

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");

return(
     <>
     <Header />
     <div className="login-container">
        <div className="login-card">
            {!isLoggedIn ? (
                <>
                    <h1 className="login-title">Welcome</h1>
                    <p className="login-subtitle">Sign in to your account</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
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
                            />
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="login-hint">New user? <Link to="/signup">Sign Up</Link></p>
                </>
            ) : (
                <div className="logout-card">
                    <h1 className="welcome-message">Welcome, {storedUsername}! 👋</h1>
                    <p className="logout-subtitle">You are logged in</p>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            )}
        </div>
     </div>
     <Footer />
     </>
);

}

export default Login
