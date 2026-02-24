import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

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
  const [productRequests, setProductRequests] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [deletedProductIds, setDeletedProductIds] = useState([]);
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
    axios.get("https://dummyjson.com/products").then((res) => {
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
  };

  const rejectRequest = (productId) => {
    const nextRequests = productRequests.filter((item) => item.id !== productId);
    setProductRequests(nextRequests);
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
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

  const addProduct = () => {
    const title = formData.title.trim();
    const category = formData.category.trim() || "general";
    const priceValue = Number(formData.price);
    const thumbnail = formData.thumbnail.trim() || "https://via.placeholder.com/300x200?text=Product";

    if (!title || Number.isNaN(priceValue) || priceValue <= 0) {
      alert("Enter valid title and price.");
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
  };

  return (
    <>
      <Header />
      <section style={{ padding: "40px 20px 120px", textAlign: "center" }}>
        <h2>Admin Dashboard</h2>
        <p>Welcome, {username || "Admin"}.</p>
        <div
          id="product-management"
          style={{
            maxWidth: "900px",
            margin: "20px auto",
            padding: "16px",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#111827",
            textAlign: "left"
          }}
        >
          <h3>Add Product</h3>
          <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
            <input name="price" type="number" min="1" placeholder="Price" value={formData.price} onChange={handleChange} />
            <input name="thumbnail" placeholder="Image URL" value={formData.thumbnail} onChange={handleChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px", marginTop: "12px" }}
            />
          )}
          <button onClick={addProduct} style={{ marginTop: "12px" }}>Add Product</button>
        </div>

        <h3>Product Permission Requests</h3>
        {productRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div style={{ maxWidth: "900px", margin: "20px auto", textAlign: "left" }}>
            {productRequests.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  color: "#111827",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px", marginRight: "10px", verticalAlign: "middle" }}
                    />
                  )}
                  <strong>{item.title}</strong> (${item.price}) - Requested by {item.requestedBy}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => approveRequest(item.id)}>Approve</button>
                  <button onClick={() => rejectRequest(item.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ marginTop: "30px" }}>All Products</h3>
        {allProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div style={{ maxWidth: "900px", margin: "20px auto", textAlign: "left" }}>
            {allProducts.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  color: "#111827",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px", marginRight: "10px", verticalAlign: "middle" }}
                    />
                  )}
                  <strong>{item.title}</strong> (${item.price}) - {item.category}
                </div>
                <button onClick={() => deleteProduct(item.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Admin;
