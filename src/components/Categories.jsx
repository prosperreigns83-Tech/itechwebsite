import React, { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import ProductCard from "./ProductCard";
import FlashTimer from "./FlashTimer";
import { fetchAllProducts } from "../utils/productApi";

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: '< $100', min: 0, max: 100 },
  { label: '$100 - $300', min: 100, max: 300 },
  { label: '$300+', min: 300, max: Infinity },
];

export default function Categories({ activePage, onNavigate, onToggleChat, initialCategory }){
  const [activeCategory, setActiveCategory] = useState(initialCategory || null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const saleEndTime = useMemo(() => Date.now() + 6 * 60 * 60 * 1000, []);

  useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await fetchAllProducts();
        setProductsList(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProductsList([]);
      }
    };
    load();
  }, []);
  const categories = useMemo(() => (
    Array.from(new Set(productsList.map((item) => item.category || 'Other'))).filter(Boolean)
  ), [productsList]);

  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const filteredProducts = productsList.filter((item) => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    const price = parseFloat((item.price || '0').toString().replace(/[^0-9.-]+/g, '')) || 0;
    const matchesPrice = price >= selectedPriceRange.min && price < selectedPriceRange.max;
    return matchesCategory && matchesPrice;
  });
  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:800,fontSize:18,color:'var(--text)'}}>Categories</div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <button type="button" className="chat-toggle" onClick={onToggleChat}>💬</button>
            <div style={{color:'#94A3B8',cursor:'pointer'}} onClick={()=>onNavigate('home')}>Close</div>
          </div>
        </div>

        <div style={{marginTop:16, display:'flex', gap: 10, flexWrap:'wrap', alignItems:'center'}}>
          <button
            type="button"
            className="category"
            onClick={() => setCategoriesOpen((open) => !open)}
            style={{ minWidth: 160 }}
          >
            {activeCategory || 'All'}
          </button>
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              className={`category ${selectedPriceRange.label === range.label ? 'category-active' : ''}`}
              onClick={() => setSelectedPriceRange(range)}
              style={{minWidth:120}}
            >
              {range.label}
            </button>
          ))}
        </div>

        {categoriesOpen && (
          <div style={{marginTop:12, padding: 12, borderRadius: 20, background: 'var(--glass-bg)', border: '1px solid var(--border)'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10}}>
              <button
                type="button"
                className={`category ${activeCategory === null ? 'category-active' : ''}`}
                onClick={() => {
                  setActiveCategory(null);
                  setCategoriesOpen(false);
                }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category ${activeCategory === category ? 'category-active' : ''}`}
                  onClick={() => {
                    setActiveCategory(activeCategory === category ? null : category);
                    setCategoriesOpen(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:14,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{color:'#94A3B8',fontSize:13}}>Active filters:</div>
          <div style={{fontWeight:700}}>{activeCategory || 'All categories'}</div>
          <div style={{fontWeight:700}}>{selectedPriceRange.label}</div>
          {(activeCategory || selectedPriceRange.label !== 'All prices') && (
            <button
              type="button"
              className="section-action"
              style={{padding:'8px 14px',fontSize:13}}
              onClick={() => {
                setActiveCategory(null);
                setSelectedPriceRange(PRICE_RANGES[0]);
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <FlashTimer endTime={saleEndTime} onSeeAll={() => onNavigate('home')} title="Category Flash Sale" buttonLabel="Back to home" />

        <div style={{marginTop:20,fontWeight:700,color:'var(--text)'}}>
          {activeCategory ? `${activeCategory} Products` : 'All Products'}
        </div>
        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              subtitle={product.subtitle}
              image={product.image}
              videoUrl={product.videoUrl}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
      <BottomNav active={activePage} onNavigate={onNavigate} />
    </div>
  )
}
