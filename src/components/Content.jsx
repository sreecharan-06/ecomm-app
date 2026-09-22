import { Link } from "react-router-dom";

function Content() {
  const scrollToFeatured = (e) => {
    e.preventDefault();
    const target = document.getElementById("featured-products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="content">
      <div className="hero-box">
        <div className="badge badge-primary">⚡ Official Campus Store & Tech Depot</div>
        <h1>Next-Gen Student Commerce at <span>KL University</span></h1>
        <p>
          Discover curated electronics, daily campus gear, lifestyle accessories, and academic stationery at exclusive student-discounted rates with express hostel delivery.
        </p>

        <div className="hero-actions">
          <Link to="/products" className="btn-primary">
            Explore All Products →
          </Link>
          <button onClick={scrollToFeatured} className="btn-secondary">
            View Trending Deals ↓
          </button>
        </div>

        {/* Campus Value Proposition Bar */}
        <div className="campus-perks-strip">
          <div className="perk-item">
            <div className="perk-icon">⚡</div>
            <div>
              <h4>2-Hour Delivery</h4>
              <p>Direct to all hostels & campus blocks</p>
            </div>
          </div>

          <div className="perk-item">
            <div className="perk-icon">🏷️</div>
            <div>
              <h4>Student Discounts</h4>
              <p>Up to 25% off with valid college ID</p>
            </div>
          </div>

          <div className="perk-item">
            <div className="perk-icon">🛡️</div>
            <div>
              <h4>Verified Quality</h4>
              <p>Official warranty on all electronics</p>
            </div>
          </div>

          <div className="perk-item">
            <div className="perk-icon">🔄</div>
            <div>
              <h4>Easy Exchange</h4>
              <p>Hassle-free 7-day campus return</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;