import React, { useEffect, useState } from "react";
import { PLANS, createInvestment, getInvestments, redeemInvestment } from "../utils/investmentStore";

export default function Invest({ onNavigate, profileData }) {
  const [plan, setPlan] = useState(PLANS[0].id);
  const [amount, setAmount] = useState(1000);
  const [status, setStatus] = useState("");
  const [investments, setInvestments] = useState([]);

  const load = () => {
    const items = getInvestments(profileData?.id);
    setInvestments(items);
  };

  useEffect(() => {
    load();
    const onUpdated = () => load();
    window.addEventListener('investments-updated', onUpdated);
    return () => window.removeEventListener('investments-updated', onUpdated);
  }, [profileData]);

  const handleInvest = async (e) => {
    e.preventDefault();
    try {
      setStatus('Creating investment...');
      const inv = createInvestment(profileData?.id, plan, amount);
      setStatus(`Investment created: ${inv.id} — matures ${new Date(inv.maturityDate).toLocaleDateString()}`);
      load();
    } catch (err) {
      setStatus(err.message || 'Failed to create investment');
    }
  };

  const handleRedeem = (id) => {
    try {
      const result = redeemInvestment(id);
      setStatus(`Redeemed: ${result.payoutAmount}`);
      load();
    } catch (err) {
      setStatus(err.message || 'Redeem failed');
    }
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button type="button" onClick={() => onNavigate('wallet')} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}>← Back</button>
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, textTransform: 'uppercase' }}>Invest</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>Investment Plans</div>
          </div>
          <div style={{ width: 40 }} />
        </div>

        <form onSubmit={handleInvest} style={{ display: 'grid', gap: 12 }}>
          <label className="login-label">Choose plan</label>
          <select className="login-input" value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANS.map((p) => <option key={p.id} value={p.id}>{p.label} — {p.roiPercent || p.roi}</option>)}
          </select>

          <label className="login-label">Amount</label>
          <input className="login-input" type="number" min={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary">Invest</button>
            <button type="button" className="btn-secondary" onClick={() => onNavigate('wallet')}>Cancel</button>
          </div>
        </form>

        {status && <div style={{ marginTop: 12, color: '#A7F3D0' }}>{status}</div>}

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>Your investments</div>
          {investments.length === 0 ? (
            <div style={{ color: '#94A3B8' }}>No investments yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {investments.map((inv) => (
                <div key={inv.id} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{inv.planLabel} — {inv.amount}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>Matures: {new Date(inv.maturityDate).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10B981', fontWeight: 700 }}>{inv.projectedReturn} projected</div>
                      {inv.status === 'active' ? (
                        <div style={{ marginTop: 8 }}>
                          <button type="button" className="btn-primary" onClick={() => handleRedeem(inv.id)} style={{ minWidth: 140 }}>Redeem</button>
                        </div>
                      ) : (
                        <div style={{ color: '#94A3B8' }}>Closed • Payout: {inv.payoutAmount}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
