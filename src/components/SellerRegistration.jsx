import React, { useState } from "react";
import PageShell from "./PageShell";
import { useStore } from "../context/StoreContext";

export default function SellerRegistration({ onNavigate }) {
  const { login } = useStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", shop: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ ...form, role: "seller" });
    onNavigate("seller-dashboard");
  };

  return (
    <PageShell title="Seller Registration" description="Create your seller account and start listing products.">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 520 }}>
        {['Name','Email','Password','Shop Name'].map((label, index) => (
          <div key={label} style={{ display: 'grid', gap: 6 }}>
            <label style={{ color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>{label}</label>
            <input
              type={label === 'Password' ? 'password' : 'text'}
              value={Object.values(form)[index] || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, [Object.keys(form)[index]]: e.target.value }))}
              className="login-input"
              placeholder={label}
            />
          </div>
        ))}
        <button className="btn-primary" type="submit">Start Selling</button>
      </form>
    </PageShell>
  );
}
