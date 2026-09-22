import { useEffect, useMemo, useState, useContext } from "react";
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

function Admin() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");
  const { showToast } = useContext(CartContext) || {};

  const [productRequests, setProductRequests] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [deletedProductIds, setDeletedProductIds] = useState([]);
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "products"

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    thumbnail: ""
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate("/login");
    }
  }, [isLoggedIn, role, navigate]);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=50").then((res) => {
      setApiProducts(res.data.products || []);
    });

    setProductRequests(readStorageArray("productRequests"));
    setApprovedProducts(readStorageArray("approvedProducts"));
    setCustomProducts(readStorageArray("customProducts"));
    setDeletedProductIds(readStorageArray("deletedProductIds"));
  }, []);

  const approveRequest = (productId) => {
    const nextApproved = approvedProducts.includes(productId)
      ? approvedProducts
      : [...approvedProducts, productId];
    const nextRequests = productRequests.filter((item) => item.id !== productId);

    setApprovedProducts(nextApproved);
    setProductRequests(nextRequests);
    localStorage.setItem("approvedProducts", JSON.stringify(nextApproved));
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
    if (showToast) showToast("Product request approved successfully!", "success");
  };

  const rejectRequest = (productId) => {
    const nextRequests = productRequests.filter((item) => item.id !== productId);
    setProductRequests(nextRequests);
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
    if (showToast) showToast("Product request rejected.", "info");
  };

  const allProducts = useMemo(() => {
    const deleted = new Set(deletedProductIds);
    const visibleApi = apiProducts.filter((item) => !deleted.has(item.id));
    const visibleCustom = customProducts.filter((item) => !deleted.has(item.id));
    return [...visibleCustom, ...visibleApi];
  }, [apiProducts, customProducts, deletedProductIds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "thumbnail") {
      setImagePreview(value.trim());
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = typeof reader.result === "string" ? reader.result : "";
      setFormData((prev) => ({ ...prev, thumbnail: imageData }));
      setImagePreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  const addProduct = (e) => {
    if (e) e.preventDefault();
    const title = formData.title.trim();
    const category = formData.category.trim() || "campus-gear";
    const priceValue = Number(formData.price);
    const thumbnail = formData.thumbnail.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";

    if (!title || Number.isNaN(priceValue) || priceValue <= 0) {
      if (showToast) showToast("Please enter a valid product title and price.", "warning");
      else alert("Enter valid title and price.");
      return;
    }

    const newProduct = {
      id: `custom-${Date.now()}`,
      title,
      category,
      price: priceValue,
      thumbnail
    };

    const nextCustomProducts = [newProduct, ...customProducts];
    setCustomProducts(nextCustomProducts);
    localStorage.setItem("customProducts", JSON.stringify(nextCustomProducts));
    setFormData({ title: "", category: "", price: "", thumbnail: "" });
    setImagePreview("");
    if (showToast) showToast(`Product "${title}" added to campus store!`, "success");
  };

  const deleteProduct = (productId) => {
    const deletedSet = new Set(deletedProductIds);
    deletedSet.add(productId);
    const nextDeletedIds = Array.from(deletedSet);
    const nextCustomProducts = customProducts.filter((item) => item.id !== productId);
    const nextRequests = productRequests.filter((item) => item.id !== productId);
    const nextApproved = approvedProducts.filter((id) => id !== productId);

    setDeletedProductIds(nextDeletedIds);
    setCustomProducts(nextCustomProducts);
    setProductRequests(nextRequests);
    setApprovedProducts(nextApproved);

    localStorage.setItem("deletedProductIds", JSON.stringify(nextDeletedIds));
    localStorage.setItem("customProducts", JSON.stringify(nextCustomProducts));
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
    localStorage.setItem("approvedProducts", JSON.stringify(nextApproved));
    if (showToast) showToast("Product removed from catalog.", "info");
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: "1100px", margin: "40px auto 80px", padding: "0 24px", width: "100%" }}>
        {/* Admin Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "8px" }}>Administrator Control Center</div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", margin: 0 }}>Campus Store Management</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Logged in as <strong>{username || "Admin"}</strong> · Full administrative privileges enabled.
            </p>
          </div>
        </div>

        {/* Metric Cards Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "36px" }}>
          <div style={{ background: "rgba(19, 27, 46, 0.7)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Total Products</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>{allProducts.length}</div>
            <span style={{ fontSize: "12px", color: "var(--accent-cyan)" }}>Active across catalog</span>
          </div>

          <div style={{ background: "rgba(19, 27, 46, 0.7)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Pending Requests</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: productRequests.length > 0 ? "var(--accent-amber)" : "#fff", marginTop: "4px" }}>
              {productRequests.length}
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Student cart permissions</span>
          </div>

          <div style={{ background: "rgba(19, 27, 46, 0.7)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Custom Added</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#34d399", marginTop: "4px" }}>{customProducts.length}</div>
            <span style={{ fontSize: "12px", color: "var(--accent-emerald)" }}>Uploaded campus goods</span>
          </div>
        </div>

        {/* Add Product Card */}
        <div style={{ background: "rgba(19, 27, 46, 0.8)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "28px", marginBottom: "40px" }}>
          <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>Add New Product to Catalog</h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
            Publish new textbooks, campus kits, electronics, or lab uniforms directly to the student shop.
          </p>

          <form onSubmit={addProduct}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Product Title</label>
                <input
                  name="title"
                  placeholder="e.g. KL Engineering Lab Coat"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  name="category"
                  placeholder="e.g. apparel, gadgets, books"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="e.g. 29.99"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  name="thumbnail"
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Or Upload Local Image:
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ fontSize: "13px", color: "var(--text-muted)" }}
                />
              </div>

              {imagePreview && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-color)" }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--accent-emerald)" }}>✓ Image ready</span>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ marginLeft: "auto" }}>
                + Publish Product to Catalog
              </button>
            </div>
          </form>
        </div>

        {/* Tab Selection */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            className={`btn-secondary btn-sm ${activeTab === "requests" ? "btn-primary" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Permission Requests ({productRequests.length})
          </button>
          <button
            className={`btn-secondary btn-sm ${activeTab === "products" ? "btn-primary" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            All Inventory ({allProducts.length})
          </button>
        </div>

        {/* Tab 1: Requests */}
        {activeTab === "requests" && (
          <div>
            {productRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: "28px" }}>✓</span>
                <h4 style={{ color: "#fff", marginTop: "8px" }}>No Pending Requests</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>All student cart permission requests have been reviewed.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {productRequests.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(19, 27, 46, 0.7)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.03)" }}
                        />
                      )}
                      <div>
                        <strong style={{ color: "#fff", fontSize: "15px", display: "block" }}>{item.title}</strong>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                          Price: <strong style={{ color: "#fff" }}>${item.price}</strong> · Requested by student: <span className="badge badge-primary">{item.requestedBy}</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => approveRequest(item.id)}
                        className="btn-primary btn-sm"
                        style={{ background: "#10b981", borderColor: "#10b981" }}
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => rejectRequest(item.id)}
                        className="btn-secondary btn-sm"
                        style={{ color: "#fb7185", borderColor: "rgba(244,63,94,0.3)" }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Inventory */}
        {activeTab === "products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {allProducts.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(19, 27, 46, 0.6)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "6px" }}
                    />
                  )}
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14.5px" }}>{item.title}</strong>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      ${item.price} · <span style={{ textTransform: "capitalize" }}>{item.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteProduct(item.id)}
                  className="cart-remove-btn"
                  title="Delete from Catalog"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Admin;
