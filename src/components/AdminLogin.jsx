import React, { useState } from "react";

const ADMIN_PASSWORD = "itechadmin";

export default function AdminLogin({ onAuthSuccess, onNavigate }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError("");
      onAuthSuccess();
      return;
    }
    setError("Incorrect password. Please try again.");
  };

  return (
    <div className="app-shell">
      <div className="home" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>Admin Login</div>
          <div style={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => onNavigate("profile")}>Back</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <label className="login-label">Admin password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ paddingRight: 45 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#94A3B8'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="btn-primary" type="submit" style={{ marginTop: 12 }}>
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
