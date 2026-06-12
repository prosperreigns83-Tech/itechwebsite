import React from "react";

const NAV_ITEMS = [
  {id:'home', label:'Home', icon:'🏠'},
  {id:'categories', label:'Categories', icon:'◻️'},
  // courses removed from bottom nav to save mobile space; accessible via Profile
  {id:'videos', label:'Videos', icon:'🎥'},
  {id:'cart', label:'Cart', icon:'🛒'},
  {id:'profile', label:'Profile', icon:'👤'}
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <div className={`nav-icon-wrapper ${active === item.id ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
          </div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
      <button className="nav-item action" onClick={() => onNavigate('cart')}>
        <div className="nav-icon-wrapper action">
          <span className="nav-icon">⚡</span>
        </div>
        <span className="nav-label">Buy</span>
      </button>
    </div>
  );
}
