import { useEffect, useState } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import "./components/Styles.css"
import "./App.css"
import Cart from "./components/Cart"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Products1 from "./components/Products1"
import Admin from "./components/Admin"
import User from "./components/User"
import { CartContext } from "./context/CartContext"

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toDateString());
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast(`Added "${product.title}" to your cart!`, "success");
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);
      if (item) {
        showToast(`Removed "${item.title}" from cart.`, "info");
      }
      return prevCart.filter(i => i.id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch (e) {
      console.error(e);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, totalCartCount, addToCart, removeFromCart, updateQuantity, clearCart, showToast }}>
      <HashRouter>
        <div className="global-date-time" title="System Live Time">
          <span className="global-date-time-dot"></span>
          <p><strong>{currentDate}</strong> · {currentTime}</p>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products1 />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
        </Routes>

        {/* Floating Toast Notification Stack */}
        <div className="toast-portal-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast-portal-item ${t.type}`}>
              <span>{t.type === "success" ? "✓" : t.type === "info" ? "ℹ" : "⚠"}</span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </HashRouter>
    </CartContext.Provider>
  );
}

export default App;
