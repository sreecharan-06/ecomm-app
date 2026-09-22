import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Content from "./Content";
import Highlights from "./Highlights";
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";

const readStorageArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart, showToast } = useContext(CartContext) || {};
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products?limit=8")
      .then(res => {
        const apiProducts = res.data.products || [];
        const customProducts = readStorageArray("customProducts");
        const deletedProductIds = new Set(readStorageArray("deletedProductIds"));
        const merged = [...customProducts, ...apiProducts].filter(
          item => !deletedProductIds.has(item.id)
        );
        setFeaturedProducts(merged.slice(0, 8));
      })
      .catch(err => {
        console.error("Failed to load featured products", err);
      });
  }, []);

  const handleAddToCart = (product) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      if (showToast) {
        showToast("Please sign in first to add items to your cart!", "warning");
      } else {
        alert("Please login first!");
      }
      navigate("/login");
      return;
    }
    if (addToCart) {
      addToCart(product);
    }
  };

  const filtered = selectedCategory === "all"
    ? featuredProducts
    : featuredProducts.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <Header />
      <Content />

      {/* Featured Products Showcase Section */}
      <section id="featured-products" style={{ maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
        <div className="section-title-wrap">
          <div className="badge badge-amber">Trending This Week</div>
          <h2>Popular Student Picks</h2>
          <p>Hand-picked top rated devices, accessories, and campus daily necessities.</p>
        </div>

        {/* Category Quick Filter */}
        <div className="category-filter-bar">
          <button 
            className={`category-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Featured
          </button>
          <button 
            className={`category-pill ${selectedCategory === "beauty" ? "active" : ""}`}
            onClick={() => setSelectedCategory("beauty")}
          >
            Beauty & Grooming
          </button>
          <button 
            className={`category-pill ${selectedCategory === "fragrances" ? "active" : ""}`}
            onClick={() => setSelectedCategory("fragrances")}
          >
            Fragrances
          </button>
          <button 
            className={`category-pill ${selectedCategory === "groceries" ? "active" : ""}`}
            onClick={() => setSelectedCategory("groceries")}
          >
            Groceries
          </button>
        </div>

        <div className="products">
          {filtered.map(p => (
            <div className="product" key={p.id}>
              <div className="product-img-wrapper">
                {p.discountPercentage && (
                  <span className="product-discount-tag badge badge-discount">
                    -{Math.round(p.discountPercentage)}% OFF
                  </span>
                )}
                <span className="product-category-tag badge badge-cyan">
                  {p.category}
                </span>
                <img src={p.thumbnail} alt={p.title} loading="lazy" />
              </div>

              <div className="product-rating">
                <span>★</span>
                <span>{p.rating ? p.rating.toFixed(1) : "4.8"}</span>
                <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>
                  ({Math.floor((p.id * 17) % 80 + 20)})
                </span>
              </div>

              <h3>{p.title}</h3>

              <div className="product-price-row">
                <span className="product-price">${p.price}</span>
                {p.discountPercentage && (
                  <span className="product-price-orig">
                    ${(p.price * (1 + p.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <button onClick={() => handleAddToCart(p)}>
                Add to Cart 🛒
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link to="/products" className="btn-secondary">
            View All {featuredProducts.length > 0 ? "50+" : ""} Catalog Products →
          </Link>
        </div>
      </section>

      <Highlights />
      <Footer />
    </>
  );
}

export default Home;