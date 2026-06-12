import React, { useState } from "react";
import PageShell from "./PageShell";
import { useStore } from "../context/StoreContext";
import { getUsers } from "../utils/userStore";

export default function SellerLogin({ onNavigate }) {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getUsers().find((u) => u.email === email && u.password === password && u.role === "seller");
    if (!user) {
      setError("Seller credentials not found.");
      return;
    }
    login(user);
    onNavigate("seller-dashboard");
  };

  return (
    <PageShell title="Seller Login" description="Access your seller dashboard and product tools.">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 520 }}>
        <input className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {error && <div style={{ color: "#FCA5A5" }}>{error}</div>}
        <button className="btn-primary" type="submit">Login as Seller</button>
      </form>
    </PageShell>
  );
}
