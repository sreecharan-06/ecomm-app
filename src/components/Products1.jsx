import React, { useState, useEffect, useContext } from "react";
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

function Products1(){
  const [products, setProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [productRequests, setProductRequests] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then(res => {
        const apiProducts = res.data.products || [];
        const customProducts = readStorageArray("customProducts");
        const deletedProductIds = new Set(readStorageArray("deletedProductIds"));
        const mergedProducts = [...customProducts, ...apiProducts].filter(
          (item) => !deletedProductIds.has(item.id)
        );
        setProducts(mergedProducts);
      })
      }, []);

  useEffect(() => {
    setApprovedProducts(readStorageArray("approvedProducts"));
    setProductRequests(readStorageArray("productRequests"));
  }, []);

  const requestPermission = (product) => {
    const username = localStorage.getItem("username") || "user";
    const nextRequests = [...productRequests, {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      requestedBy: username
    }];

    setProductRequests(nextRequests);
    localStorage.setItem("productRequests", JSON.stringify(nextRequests));
    alert(`Permission request sent for "${product.title}". Wait for admin approval.`);
  };

const handleAddToCart = (product) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");
    const isApproved = approvedProducts.includes(product.id);
    const isAlreadyRequested = productRequests.some((item) => item.id === product.id);

    if (isLoggedIn) {
      if (role === "user" && !isApproved) {
        if (isAlreadyRequested) {
          alert("This product is pending admin approval.");
          return;
        }
        requestPermission(product);
        return;
      }
      addToCart(product);
      alert(`${product.title} added to cart!`);
      navigate("/cart");
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  };

  return(
    <>
    <Header />

      <section className="products">
        {products.map((p) => (
          <div className="product" key={p.id}>
            <img src={p.thumbnail} alt={p.title} />
            <h3>{p.title}</h3>
            <p>Category: {p.category}</p>
            <p>Price: ${p.price}</p>
            <button onClick={() => handleAddToCart(p)}>
              {localStorage.getItem("role") === "user" && !approvedProducts.includes(p.id)
                ? productRequests.some((item) => item.id === p.id)
                  ? "Pending Approval"
                  : "Request Permission"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </section>

      <Footer />

    </>
  )
}

export default Products1
