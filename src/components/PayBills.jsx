import React, { useState } from "react";

const BILLERS = ["Electricity", "TV Subscription", "Internet", "Water"];

export default function PayBills({ onNavigate, profileData }) {
  const [biller, setBiller] = useState(BILLERS[0]);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(500);
  const [status, setStatus] = useState("");

  const handlePay = (e) => {
    e.preventDefault();
    if (!account || account.length < 3) {
      setStatus('Enter a valid account number');
      return;
    }
    if (!amount || amount <= 0) {
      setStatus('Enter a valid amount');
      return;
    }

    const bills = JSON.parse(localStorage.getItem('itechBills') || '[]');
    const record = { id: `bill-${Date.now()}`, biller, account, amount: Number(amount), date: new Date().toISOString(), user: profileData?.id || 'guest' };
    bills.unshift(record);
    localStorage.setItem('itechBills', JSON.stringify(bills));
    setStatus(`Bill payment queued: ${biller} ${amount}`);
    setTimeout(() => onNavigate('wallet'), 1200);
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={() => onNavigate('wallet')} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}>← Back</button>
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase' }}>Bills</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>Pay Bills</div>
          </div>
          <div style={{ width: 40 }} />
        </div>

        <form onSubmit={handlePay} style={{ display: 'grid', gap: 12 }}>
          <label className="login-label">Biller</label>
          <select className="login-input" value={biller} onChange={(e) => setBiller(e.target.value)}>
            {BILLERS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <label className="login-label">Account number</label>
          <input className="login-input" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Account or customer number" />

          <label className="login-label">Amount</label>
          <input className="login-input" type="number" min={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary">Pay Bill</button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('wallet')}>Cancel</button>
          </div>
        </form>

        {status && <div style={{ marginTop: 12, color: '#A7F3D0' }}>{status}</div>}
      </div>
    </div>
  );
}
