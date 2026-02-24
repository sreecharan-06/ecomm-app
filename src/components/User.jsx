import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function User() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!isLoggedIn || role !== "user") {
      navigate("/login");
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <>
      <Header />
      <section style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2>User Dashboard</h2>
        <p>Welcome, {username || "User"}.</p>
      </section>
      <Footer />
    </>
  );
}

export default User;
