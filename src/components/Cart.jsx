import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./CartStyles.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate("/products")} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="product-info">
                    <img src={item.thumbnail || item.image} alt={item.title} />
                    <span>{item.title}</span>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
        <button className="checkout-btn">Proceed to Checkout</button>
        <button onClick={() => navigate("/products")} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;