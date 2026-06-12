import React, { useState } from "react";

const PROVIDERS = ["MTN", "GLO", "Airtel", "9mobile"];

export default function BuyAirtime({ onNavigate, profileData }) {
  const [phone, setPhone] = useState(profileData?.phone || "");
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [amount, setAmount] = useState(100);
  const [status, setStatus] = useState("");

  const handleBuy = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 7) {
      setStatus("Enter a valid phone number");
      return;
    }
    if (!amount || amount <= 0) {
      setStatus("Enter a valid amount");
      return;
    }

    // Minimal demo: save to localStorage as mock purchase and show confirmation
    const purchases = JSON.parse(localStorage.getItem("itechAirtime") || "[]");
    const record = {
      id: `airtime-${Date.now()}`,
      phone,
      provider,
      amount: Number(amount),
      date: new Date().toISOString(),
      user: profileData?.id || "guest",
    };
    purchases.unshift(record);
    localStorage.setItem("itechAirtime", JSON.stringify(purchases));
    setStatus(`Airtime purchase queued: ${provider} ${amount} to ${phone}`);
    setTimeout(() => onNavigate("wallet"), 1200);
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={() => onNavigate('wallet')} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}>← Back</button>
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase' }}>Airtime</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>Buy Airtime</div>
          </div>
          <div style={{ width: 40 }} />
        </div>

        <form onSubmit={handleBuy} style={{ display: 'grid', gap: 12 }}>
          <label className="login-label">Phone number</label>
          <input className="login-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801xxxxxxx" />

          <label className="login-label">Provider</label>
          <select className="login-input" value={provider} onChange={(e) => setProvider(e.target.value)}>
            {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <label className="login-label">Amount</label>
          <input className="login-input" type="number" min={50} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary">Buy Airtime</button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('wallet')}>Cancel</button>
          </div>
        </form>

        {status && <div style={{ marginTop: 12, color: '#A7F3D0' }}>{status}</div>}
      </div>
    </div>
  );
}
