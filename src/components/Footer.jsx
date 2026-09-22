import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <strong>KL University Shop</strong> · Official Campus E-Commerce Portal
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/products">Catalog</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/admin">Admin</Link>
        </div>
        <div>
          © {new Date().getFullYear()} KL University Shop. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;