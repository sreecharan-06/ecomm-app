import { useEffect, useState } from "react"
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import "./Components/Styles.css"
import "./App.css"
import Cart from "./components/Cart"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Products1 from "./components/Products1"
import Admin from "./components/Admin"
import User from "./components/User"
import { CartContext } from "./context/CartContext"

function App(){
  const [cart, setCart] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toDateString());
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

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
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
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

  return(
    <>
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
    <HashRouter>
    <div className="global-date-time">
      <p>The current Date is: {currentDate}</p>
      <p>The current time is: {currentTime}</p>
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
    </HashRouter>
    </CartContext.Provider>
    </>
  )
}
export default App
