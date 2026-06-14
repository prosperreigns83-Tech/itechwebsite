import React, { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import BottomNav from "./BottomNav";
import FlashTimer from "./FlashTimer";
import ToggleMenu from "./ToggleMenu";
import { fetchAllProducts, searchProducts } from "../utils/productApi";
import { getPublicProducts } from "../utils/productStore";
import { resolveAssetPath } from "../utils/assetPath";

const SLIDES = [
  {
    id:1,
    title:'Future Starts Here',
    subtitle:'Explore the latest gadgets of 2024',
    image:'/images/p1.jpg'
  },
  {
    id:2,
    title:'Ultra Performance',
    subtitle:'Powerful chips, sleek designs',
    image:'/images/light1.webp'
  },
  {
    id:3,
    title:'Accessories',
    subtitle:'Sound, power, and style',
    image:'/images/fan.png'
  },
  {
    id:4,
    title:'Latest Innovation',
    subtitle:'Cutting edge technology',
    image:'/images/mp17.jpg'
  },
];

const FEATURE_PRODUCTS = [
  { title: 'Samsung Galaxy S24', price: '₦1,199.00', subtitle: 'Premium flagship phone with advanced camera system.', image: '/images/p1.jpg' },
  { title: 'iPhone 15 Pro Max', price: '₦800,000', subtitle: 'Sleek design and pro-grade performance.', image: '/images/p3.jpg' },
  { title: 'Premium Wireless Earbuds', price: '₦249.00', subtitle: 'Immersive audio with active noise cancellation.', image: '/images/p4.jpg' },
  { title: 'Portable Power Bank', price: '₦79.00', subtitle: 'Fast charging for all your mobile devices.', image: '/images/p5.jpg' },
  { title: 'MacBook Air M3', price: '₦1,099.00', subtitle: 'Ultra-thin laptop with long battery life.', image: '/images/mp17.jpg' },
  { title: 'Dell XPS 13', price: '₦1,179.00', subtitle: 'Compact productivity laptop with a premium display.', image: '/images/mp16.jpg' },
  { title: 'Smart Sports Watch', price: '₦199.00', subtitle: 'Fitness tracking, GPS, and health monitoring.', image: '/images/mp15.jpg' },
  { title: 'Gaming Headset', price: '₦179.00', subtitle: 'Comfortable over-ear design with surround sound.', image: '/images/mp14.jpg' },
  { title: 'Foldable Display Phone', price: '₦1,399.00', subtitle: 'Next-gen foldable screen for multitasking.', image: '/images/mp12.jpg' },
  { title: 'Wireless Speaker', price: '₦129.00', subtitle: 'Rich audio with bass boost.', image: '/images/mp10.jpg' },
  { title: 'Smart Home Fan', price: '₦99.00', subtitle: 'Quiet cooling with smart controls.', image: '/images/fan.png' },
  { title: 'Home Office Monitor', price: '₦299.00', subtitle: 'High-resolution display for work and play.', image: '/images/f17.jpg' },
  { title: 'Adjustable Laptop Stand', price: '₦59.00', subtitle: 'Ergonomic desk stand for comfort.', image: '/images/f16.jpg' },
  { title: 'Mechanical Keyboard', price: '₦139.00', subtitle: 'RGB lighting and tactile switches.', image: '/images/f15.jpg' },
  { title: 'Precision Gaming Mouse', price: '₦89.00', subtitle: 'High-precision sensor for pro gamers.', image: '/images/f14.jpg' },
  { title: 'Studio Lighting Kit', price: '₦149.00', subtitle: 'Soft light for content creation.', image: '/images/light1.webp' },
  { title: 'Portable LED Light', price: '₦79.00', subtitle: 'Compact lighting for photos and videos.', image: '/images/light2.webp' },
  { title: 'Over-Ear Headphones', price: '₦219.00', subtitle: 'Premium sound with noise cancellation.', image: '/images/mp8.jpg' },
  { title: 'Compact Power Dock', price: '₦49.00', subtitle: 'Multi-port charging for phones and tablets.', image: '/images/mp6.jpg' },
  { title: 'Wireless Charging Pad', price: '₦39.00', subtitle: 'Fast wireless charging for compatible devices.', image: '/images/mp5.jpg' },
];

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: '< $100', min: 0, max: 100 },
  { label: '$100 - $300', min: 100, max: 300 },
  { label: '$300+', min: 300, max: Infinity },
];

const PROMO_IMAGES = ['/images/promo.png', '/images/promo1.png', '/images/promo2.png'];
const PROMO_FALLBACK = '/images/p1.jpg';

export default function Home({ activePage, onNavigate, onToggleChat }){
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [promoOverlayOpen, setPromoOverlayOpen] = useState(false);
  const [promoImage, setPromoImage] = useState(PROMO_IMAGES[0]);
  const topPickEndTime = useMemo(() => Date.now() + 8 * 60 * 60 * 1000, []);
  const featuredEndTime = useMemo(() => Date.now() + 14 * 60 * 60 * 1000, []);
  const promoTimerRef = useRef(null);
  const promoIndexRef = useRef(0);

  const schedulePromo = () => {
    window.clearTimeout(promoTimerRef.current);
    promoTimerRef.current = window.setTimeout(() => {
      promoIndexRef.current = (promoIndexRef.current + 1) % PROMO_IMAGES.length;
      setPromoImage(PROMO_IMAGES[promoIndexRef.current]);
      setPromoOverlayOpen(true);
    }, 30000);
  };

  const showPromoImmediately = () => {
    promoIndexRef.current = 0;
    setPromoImage(PROMO_IMAGES[promoIndexRef.current]);
    setPromoOverlayOpen(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const products = await fetchAllProducts();
        if (Array.isArray(products) && products.length > 0) {
          setProductsList(products);
        } else {
          setProductsList(getPublicProducts());
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProductsList(getPublicProducts());
      }
    };
    load();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i+1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    showPromoImmediately();
    return () => window.clearTimeout(promoTimerRef.current);
  }, []);

  const closePromoOverlay = () => {
    setPromoOverlayOpen(false);
    schedulePromo();
  };

  const categories = Array.from(new Set(productsList.map((item) => item.category || 'Other'))).filter(Boolean);

  const filteredProducts = productsList.filter((item) => {
    const text = `${item.title} ${item.subtitle} ${item.category}`.toLowerCase();
    const matchesQuery = query ? text.includes(query.toLowerCase()) : true;
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const price = parseFloat((item.price || '0').toString().replace(/[^0-9.-]+/g, '')) || 0;
    const matchesPrice = price >= selectedPriceRange.min && price < selectedPriceRange.max;
    return matchesQuery && matchesCategory && matchesPrice;
  });

  const suggestions = query.length >= 2
    ? productsList.filter((item) => {
      const text = `${item.title} ${item.subtitle} ${item.category}`.toLowerCase();
      return text.includes(query.toLowerCase());
    }).slice(0, 6)
    : [];

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div className="topbar">
          <button type="button" className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
          <div className="brand-pill">iTech Store. Call for order:09162249670</div>
          <button type="button" className="chat-toggle" onClick={onToggleChat}>💬</button>
          <button type="button" className="icon-pill">🛒</button>
        </div>

        <div className="search-shell">
          <input
            className="search"
            placeholder="Search premium gadgets, audio, wearables..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.length > 0 && query.length < 2 && (
            <div className="search-hint">Type 2+ letters to see matching items</div>
          )}
          {query.length >= 2 && (
            <div className="suggestions">
              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    type="button"
                    className="suggestion-item"
                    onClick={() => setQuery(item.title)}
                  >
                    {item.title}
                  </button>
                ))
              ) : (
                <div className="suggestion-empty">No products found</div>
              )}
            </div>
          )}
        </div>

        <div className="hero-shell glass">
          <div className="hero-copy">
            <div className="hero-badge">New drop</div>
            <h1>Luxury tech, reimagined for the future.</h1>
            <p>Shop elite gadgets with glowing detail, premium materials, and instant mobile-style navigation.</p>
            <div className="hero-actions">
              <button className="btn-primary">Shop Exclusive</button>
              <button className="btn-secondary" type="button" onClick={() => onNavigate('categories')}>Browse categories</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span>24/7</span>
                <small>Support</small>
              </div>
              <div className="hero-stat">
                <span>Free</span>
                <small>Delivery</small>
              </div>
              <div className="hero-stat">
                <span>7-Day</span>
                <small>Returns</small>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src={resolveAssetPath(SLIDES[index].image)} alt={SLIDES[index].title} className="hero-image" />
            </div>
          </div>
          <div className="dots">
            {SLIDES.map((s,i)=> <div key={s.id} className={`dot ${i===index? 'active':''}`} />)}
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-pill">Best seller picks</div>
          <div className="feature-pill">Smart filters</div>
          <div className="feature-pill">Premium packaging</div>
        </div>

        {/* Category buttons and price-range filters removed — handled in Categories page */}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
          <div>
            <div className="section-label">Quick Services</div>
            <div className="section-title">Airtime, bills, investing, and courses</div>
          </div>
          <button
            type="button"
            className="section-action"
            onClick={() => onNavigate('courses')}
          >
            Go to Courses
          </button>
        </div>

        <div className="section-header">
          <div>
            <div className="section-label">{query ? 'Search results' : 'Top picks for you'}</div>
            <div className="section-title">Curated luxury finds</div>
          </div>
          <button type="button" className="section-action" onClick={() => setQuery('')}>Clear</button>
        </div>

        <FlashTimer endTime={topPickEndTime} onSeeAll={() => onNavigate('categories')} title="Top Picks Flash Sale" buttonLabel="Shop now" />

        <div className="picks">
          {filteredProducts.map((p, idx) => (
            <ProductCard
              key={`${p.id}-${idx}`}
              title={p.title}
              price={p.price}
              subtitle={p.subtitle}
              image={p.image}
              onClick={() => setSelected(p)}
            />
          ))}
          {query && filteredProducts.length === 0 && (
            <div className="no-results">No matching products. Try another keyword.</div>
          )}
        </div>

        <div style={{ marginTop: 30, marginBottom: 24 }}>
          <FlashTimer endTime={featuredEndTime} onSeeAll={() => onNavigate('categories')} title="Featured Deals" buttonLabel="Browse now" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div>
              <div className="section-label">Featured products</div>
              <div className="section-title">Name, price, and description included</div>
            </div>
            <button type="button" className="section-action" onClick={() => onNavigate('categories')}>Browse all</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {FEATURE_PRODUCTS.map((product, idx) => (
              <ProductCard
                key={`${product.title}-${idx}`}
                title={product.title}
                price={product.price}
                subtitle={product.subtitle}
                image={product.image}
                onClick={() => setSelected(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {promoOverlayOpen && (
        <div className="promo-overlay" onClick={closePromoOverlay}>
          <div className="promo-screen glass" onClick={(e) => e.stopPropagation()}>
            <div className="promo-screen-hero">
              <img
                src={resolveAssetPath(promoImage)}
                alt="Discount promotion"
                className="promo-screen-image"
                onError={(e) => { if (e.currentTarget.src !== resolveAssetPath(PROMO_FALLBACK)) e.currentTarget.src = resolveAssetPath(PROMO_FALLBACK); }}
              />
            </div>
            <div className="promo-screen-copy">
              <div className="promo-badge">Limited time</div>
              <h2>30% OFF Flash Deal</h2>
              <p>Special discount on premium gadgets — only for the next few minutes. Tap claim to see the best offers now.</p>
              <div className="promo-actions">
                <button className="btn-primary" type="button" onClick={() => { setPromoOverlayOpen(false); onNavigate('categories'); }}>Claim Deal</button>
                <button type="button" className="promo-close" onClick={closePromoOverlay}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav active={activePage} onNavigate={onNavigate} />

      <ToggleMenu
        open={menuOpen}
        title="More"
        onClose={() => setMenuOpen(false)}
        items={[
          { label: "About Us", onClick: () => { onNavigate("about"); setMenuOpen(false); } },
          { label: "Contact", onClick: () => { onNavigate("contact"); setMenuOpen(false); } }
        ]}
      />

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
