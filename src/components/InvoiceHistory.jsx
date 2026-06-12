import React, { useState, useEffect } from "react";
import BottomNav from "./BottomNav";

export default function InvoiceHistory({ onNavigate, profileData }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch invoice history from backend or localStorage
    const stored = localStorage.getItem('itechInvoices');
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse invoices', e);
      }
    }
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      setLoading(true);
      const orderKey = invoice.orderId || invoice.referenceId;
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/invoices/${orderKey}/pdf`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/pdf' }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${orderKey}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download invoice');
      }
    } catch (err) {
      console.error('Download failed', err);
      alert('Error downloading invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    onNavigate('payment-success', invoice);
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: "18px",
              cursor: "pointer"
            }}
          >
            ←
          </button>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>
            Invoice History
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Invoice List */}
        <div style={{ padding: "14px 18px" }}>
          {invoices && invoices.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {invoices.map((invoice, index) => (
                <div
                  key={index}
                  style={{
                    background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,255,0.08))",
                    border: "1px solid rgba(59,130,246,0.25)",
                    borderRadius: 14,
                    padding: 16,
                    backdropFilter: "blur(8px)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>
                        Order #{invoice.orderId || `Order-${index}`}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        {formatDate(invoice.orderDate || new Date().toISOString())}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#60A5FA", marginBottom: 4 }}>
                        {formatCurrency(invoice.total || 0)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          background: "linear-gradient(135deg,#10B981,#059669)",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: 6,
                          fontWeight: 600,
                          display: "inline-block"
                        }}
                      >
                        ✓ {invoice.paymentStatus || 'Paid'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12, fontSize: 12 }}>
                    <div>
                      <div style={{ color: "var(--muted)", marginBottom: 2 }}>Customer</div>
                      <div style={{ color: "#fff", fontWeight: 600 }}>{invoice.customerName || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--muted)", marginBottom: 2 }}>Items</div>
                      <div style={{ color: "#fff", fontWeight: 600 }}>{(invoice.items || []).length} item(s)</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleViewDetails(invoice)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        background: "rgba(59,130,246,0.2)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        borderRadius: 10,
                        color: "#60A5FA",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 12
                      }}
                    >
                      👁️ View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(invoice)}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                        border: "none",
                        borderRadius: 10,
                        color: "#FFFFFF",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 12,
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      {loading ? '⏳ Downloading...' : '⬇️ PDF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--muted)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px dashed rgba(255,255,255,0.06)"
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No invoices yet</div>
              <div style={{ fontSize: 12 }}>Your completed orders will appear here</div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
