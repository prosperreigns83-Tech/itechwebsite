import React, { useState, useEffect } from "react";

// Nigerian locations database - All 36 states + Lagos with capitals/major cities
const LOCATIONS_DB = [
  // Northern States
  { name: "Abuja", state: "FCT", lat: 9.0765, lng: 7.3986 },
  { name: "Kano", state: "Kano", lat: 12.0022, lng: 8.6753 },
  { name: "Katsina", state: "Katsina", lat: 12.9914, lng: 7.6161 },
  { name: "Kaduna", state: "Kaduna", lat: 10.5269, lng: 7.4387 },
  { name: "Kogi", state: "Kogi", lat: 7.7927, lng: 6.7254 },
  { name: "Nasarawa", state: "Nasarawa", lat: 8.5491, lng: 8.5157 },
  { name: "Niger", state: "Niger", lat: 9.5849, lng: 6.2689 },
  { name: "Sokoto", state: "Sokoto", lat: 13.0167, lng: 5.2372 },
  { name: "Zamfara", state: "Zamfara", lat: 12.1667, lng: 6.6667 },
  { name: "Kebbi", state: "Kebbi", lat: 12.4533, lng: 4.1973 },
  { name: "Jigawa", state: "Jigawa", lat: 12.2271, lng: 9.3904 },
  { name: "Bauchi", state: "Bauchi", lat: 10.3158, lng: 9.8438 },
  { name: "Gombe", state: "Gombe", lat: 10.2831, lng: 11.1663 },
  { name: "Yobe", state: "Yobe", lat: 11.7500, lng: 11.9667 },
  { name: "Borno", state: "Borno", lat: 11.8511, lng: 13.1590 },
  { name: "Adamawa", state: "Adamawa", lat: 9.2050, lng: 12.4858 },
  { name: "Taraba", state: "Taraba", lat: 8.7832, lng: 11.3929 },
  
  // Southern States - Southwest
  { name: "Lagos", state: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Oyo", state: "Oyo", lat: 7.3775, lng: 3.8367 },
  { name: "Ogun", state: "Ogun", lat: 6.7137, lng: 3.3442 },
  { name: "Osun", state: "Osun", lat: 7.7671, lng: 4.5654 },
  { name: "Ondo", state: "Ondo", lat: 7.2527, lng: 5.1947 },
  { name: "Ekiti", state: "Ekiti", lat: 7.3158, lng: 5.2632 },
  
  // Southern States - Southeast
  { name: "Abia", state: "Abia", lat: 5.5211, lng: 7.3692 },
  { name: "Anambra", state: "Anambra", lat: 6.2333, lng: 7.0500 },
  { name: "Ebonyi", state: "Ebonyi", lat: 6.2426, lng: 8.1161 },
  { name: "Enugu", state: "Enugu", lat: 6.4549, lng: 7.5090 },
  { name: "Imo", state: "Imo", lat: 5.4833, lng: 7.0333 },
  
  // Southern States - South-South
  { name: "Rivers", state: "Rivers", lat: 4.7711, lng: 7.0244 },
  { name: "Bayelsa", state: "Bayelsa", lat: 5.0333, lng: 6.0833 },
  { name: "Delta", state: "Delta", lat: 5.7500, lng: 5.9333 },
  { name: "Edo", state: "Edo", lat: 6.3350, lng: 5.6037 },
  { name: "Cross River", state: "Cross River", lat: 4.9576, lng: 8.3419 },
  { name: "Akwa Ibom", state: "Akwa Ibom", lat: 5.0269, lng: 7.9126 },
  
  // Middle Belt
  { name: "Benue", state: "Benue", lat: 7.7333, lng: 8.5167 },
  { name: "Plateau", state: "Plateau", lat: 9.9265, lng: 8.8953 },
  { name: "Kwara", state: "Kwara", lat: 8.4833, lng: 4.5167 },
];

export default function LocationSearch({ onLocationSelect, initialValue = "" }) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialValue);

  useEffect(() => {
    if (searchValue.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const query = searchValue.toLowerCase();
    const filtered = LOCATIONS_DB.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query)
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  }, [searchValue]);

  const handleSelect = (location) => {
    const displayText = `${location.name}, ${location.state}`;
    setSelectedLocation(displayText);
    setSearchValue(displayText);
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (onLocationSelect) {
      onLocationSelect({
        name: location.name,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        displayText
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search location (city/state)"
          className="login-input"
          style={{
            paddingRight: 40
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            fontSize: 16,
            pointerEvents: "none"
          }}
        >
          📍
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            marginTop: 6,
            maxHeight: 240,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
          }}
        >
          {suggestions.map((location, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(location)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "none",
                border: "none",
                borderBottom: idx < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                textAlign: "left",
                cursor: "pointer",
                color: "var(--text)",
                fontSize: 13,
                transition: "background 200ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59,130,246,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>📍 {location.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{location.state}</div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchValue.trim().length > 0 && suggestions.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            marginTop: 6,
            padding: "16px",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 13,
            zIndex: 1000
          }}
        >
          No locations found
        </div>
      )}

      {/* Close suggestions on blur */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: showSuggestions && suggestions.length > 0 ? 999 : -1,
          cursor: "default"
        }}
        onClick={() => setShowSuggestions(false)}
      />
    </div>
  );
}
