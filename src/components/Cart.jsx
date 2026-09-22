import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./CartStyles.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, showToast } = useContext(CartContext) || {};
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [hostelRoom, setHostelRoom] = useState("Block B, Room 402");
  const [paymentMethod, setPaymentMethod] = useState("studentid");

  const totalPrice = (cart || []).reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedId = "KL-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setShowCheckoutModal(false);
    setOrderPlaced(true);
    if (clearCart) clearCart();
    if (showToast) {
      showToast(`Order #${generatedId} confirmed! Assigned to Campus Express courier.`, "success");
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <div className="cart-page-wrapper">
          <div className="empty-cart-card" style={{ borderColor: "#10b981", background: "rgba(16, 185, 129, 0.05)" }}>
            <div className="empty-cart-icon" style={{ color: "#34d399" }}>🎉</div>
            <div className="badge badge-emerald" style={{ marginBottom: "12px" }}>
              Order Confirmed #{orderId}
            </div>
            <h2>Thank You for Your Order!</h2>
            <p style={{ maxWidth: "480px", margin: "0 auto 24px" }}>
              Your order is being prepared by the campus depot and dispatched to <strong>{hostelRoom}</strong>. Estimated hostel arrival: <strong>Within 45 minutes</strong>.
            </p>
            <button onClick={() => navigate("/products")} className="btn-primary">
              Continue Shopping →
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <>
        <Header />
        <div className="cart-page-wrapper">
          <div className="empty-cart-card">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>You haven't added any campus products or gear to your bag yet.</p>
            <button onClick={() => navigate("/products")} className="btn-primary">
              Browse Catalog Products →
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page-wrapper">
        <div className="cart-header-title">
          <h2>Campus Shopping Cart</h2>
          <span className="badge badge-primary">
            {cart.reduce((t, i) => t + (i.quantity || 1), 0)} Items Selected
          </span>
        </div>

        <div className="cart-grid-layout">
          {/* Cart Table Container */}
          <div className="cart-items-card">
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
                {cart.map((item) => {
                  const qty = item.quantity || 1;
                  const itemTotal = (item.price * qty).toFixed(2);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-product-cell">
                          <img
                            src={item.thumbnail || item.image}
                            alt={item.title}
                            className="cart-product-thumb"
                          />
                          <div>
                            <div className="cart-product-title">{item.title}</div>
                            <div className="cart-product-category">{item.category || "Campus Item"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="cart-price-cell">${Number(item.price).toFixed(2)}</td>
                      <td>
                        <div className="cart-stepper">
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="stepper-value">{qty}</span>
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="cart-total-cell">${itemTotal}</td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cart-remove-btn"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Campus Express Delivery:</span>
              <span className="summary-free-badge">FREE (Hostel)</span>
            </div>
            <div className="summary-row">
              <span>Student Subsidy Tax:</span>
              <span className="summary-free-badge">$0.00</span>
            </div>
            <div className="summary-row total">
              <span>Final Total:</span>
              <span style={{ color: "#34d399" }}>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setShowCheckoutModal(true)}
              className="btn-primary btn-checkout"
            >
              Proceed to Checkout 💳
            </button>
            <button
              onClick={() => navigate("/products")}
              className="btn-secondary btn-continue"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-card">
            <button 
              className="checkout-close-btn"
              onClick={() => setShowCheckoutModal(false)}
            >
              ✕
            </button>

            <div className="badge badge-emerald" style={{ marginBottom: "12px" }}>
              Campus Checkout
            </div>
            <h3 style={{ fontSize: "22px", marginBottom: "6px" }}>Confirm Your Order</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Total Payable: <strong style={{ color: "#34d399" }}>${totalPrice.toFixed(2)}</strong>
            </p>

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label">Campus Delivery Address / Room</label>
                <input
                  type="text"
                  required
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Hostels Block B, Room 302"
                />
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-input"
                  style={{ background: "#0f172a", color: "#fff", cursor: "pointer" }}
                >
                  <option value="studentid">KL Student Smart Card (RFID Balance)</option>
                  <option value="upi">UPI / Instant QR Payment</option>
                  <option value="cod">Cash On Delivery at Hostel Desk</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label className="form-label">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Call upon reaching ground floor"
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "13px" }}>
                Confirm & Place Order →
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;