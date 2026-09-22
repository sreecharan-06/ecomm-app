import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
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

function Products1() {
  const [products, setProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const navigate = useNavigate();
  const { addToCart, showToast } = useContext(CartContext) || {};

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products?limit=50")
      .then(res => {
        const apiProducts = res.data.products || [];
        const customProducts = readStorageArray("customProducts");
        const deletedProductIds = new Set(readStorageArray("deletedProductIds"));
        const mergedProducts = [...customProducts, ...apiProducts].filter(
          item => !deletedProductIds.has(item.id)
        );
        setProducts(mergedProducts);
      })
      .catch(err => {
        console.error("Failed to load products from DummyJSON", err);
      });
  }, []);

  useEffect(() => {
    setApprovedProducts(readStorageArray("approvedProducts"));
    setProductRequests(readStorageArray("productRequests"));
  }, []);

  // Dynamically extract top categories
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set).slice(0, 7)];
  }, [products]);

  const requestPermission = (product) => {
    const username = localStorage.getItem("username") || "user";
    const nextRequests = [
      ...productRequests,
      {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        requestedBy: username
      }
    ];

    setProductRequests(nextRequests);
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
    if (showToast) {
      showToast(`Permission request sent for "${product.title}". Awaiting admin approval.`, "info");
    } else {
      alert(`Permission request sent for "${product.title}". Wait for admin approval.`);
    }
  };

  const handleAddToCart = (product) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");
    const isApproved = approvedProducts.includes(product.id);
    const isAlreadyRequested = productRequests.some(item => item.id === product.id);

    if (isLoggedIn) {
      if (role === "user" && !isApproved) {
        if (isAlreadyRequested) {
          if (showToast) {
            showToast("This product request is currently pending admin approval.", "warning");
          } else {
            alert("This product is pending admin approval.");
          }
          return;
        }
        requestPermission(product);
        return;
      }
      if (addToCart) {
        addToCart(product);
      }
    } else {
      if (showToast) {
        showToast("Please sign in first to add products to your cart!", "warning");
      } else {
        alert("Please login first!");
      }
      navigate("/login");
    }
  };

  // Filter and Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "all" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCategory;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <Header />

      <div className="section-title-wrap" style={{ marginTop: "30px" }}>
        <div className="badge badge-primary">Full Store Catalog</div>
        <h2>Explore Campus Inventory</h2>
        <p>Verified hardware, personal care, academic stationery, and daily lifestyle goods.</p>
      </div>

      {/* Catalog Search and Sort Toolbar */}
      <div className="catalog-toolbar">
        <div className="catalog-search-box">
          <span className="catalog-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="catalog-sort-select" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">Sort: Featured Picks</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="category-filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <section className="products">
        {filteredAndSorted.length === 0 ? (
          <div className="empty-catalog-state">
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📦</div>
            <h3 style={{ color: "#fff", fontSize: "20px", marginBottom: "8px" }}>No matching items found</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "18px" }}>
              We couldn't find any products matching "{searchTerm}". Try checking your spelling or clearing filters.
            </p>
            <button 
              className="btn-secondary btn-sm"
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredAndSorted.map((p) => {
            const role = localStorage.getItem("role");
            const isApproved = approvedProducts.includes(p.id);
            const isRequested = productRequests.some(item => item.id === p.id);

            return (
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
                    ({Math.floor((Number(p.id) * 13) % 70 + 15)})
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

                <button 
                  onClick={() => handleAddToCart(p)}
                  className={
                    role === "user" && !isApproved
                      ? isRequested
                        ? "pending"
                        : "request"
                      : ""
                  }
                >
                  {role === "user" && !isApproved
                    ? isRequested
                      ? "⏳ Pending Approval"
                      : "🔒 Request Permission"
                    : "Add to Cart 🛒"}
                </button>
              </div>
            );
          })
        )}
      </section>

      <Footer />
    </>
  );
}

export default Products1;
