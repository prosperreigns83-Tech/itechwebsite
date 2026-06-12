import React from "react";

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: "calc(100vh - 200px)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center"
    }}>
      <div>
        <h1 style={{ fontSize: "64px", margin: "0 0 20px 0", color: "#ef4444" }}>404</h1>
        <h2 style={{ fontSize: "32px", margin: "0 0 10px 0", color: "#1f2937" }}>Page Not Found</h2>
        <p style={{ fontSize: "16px", color: "#6b7280", margin: "0 0 30px 0" }}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => window.location.assign("/")}
            style={{ 
              display: "inline-block",
              padding: "12px 24px", 
              backgroundColor: "#3b82f6", 
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer"
            }}
          >
            Go Home
          </button>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#e5e7eb", 
              color: "#1f2937",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
