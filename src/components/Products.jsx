import { use } from "react";
import mobile from "../images/mobile.png";
import { useNavigate } from "react-router-dom";

function Products() {
    const navigate = useNavigate();

    const handleAddToCart = () => {
       const isloggedIn = localStorage.getItem("isLoggedIn");

       if (isloggedIn=="true") {
        navigate("/cart");
         } else {  
        alert("Please login first");
        navigate("/login");
         }
    };
  return (
    <div className="products">
        <div className="product">
            <img src={mobile} alt="product1" />
            <h3>Samsung Galaxy S24 FE</h3>
            <p>Rs.39,000</p>
            <button onClick ={handleAddToCart}>Add to Cart</button>

        </div>
        <div className="product">
            <img src="https://images.samsung.com/ch_fr/smartphones/galaxy-s25-ultra/buy/02_Gallery/02-2_KV_With-Exclusive-Color/02_Online-Exclusive-Single-KV_Titanium_Jetblack_PC.jpg?imbypass=true" alt="product2" />
            <h3>Samsung Galaxy S25 Ultra</h3>
            <p>Rs.79,000</p>
            <button onClick ={handleAddToCart}>Add to Cart</button>

        </div>
        <div className="product">
            <img src="https://th.bing.com/th/id/OIP.PS-fW9tJj5Oyfb93_1dCvAHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="product3" />
            <h3>Samsung Galaxy Z TriFold</h3>
            <p>Rs.2.61 lakh</p>
            <button onClick ={handleAddToCart}>Add to Cart</button>

        </div>
    </div>
  );
}

export default Products;