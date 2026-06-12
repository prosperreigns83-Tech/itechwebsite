import React, { useState } from "react";

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.ok) {
        setSent(true);
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="app-shell">
        <div className="content-wrapper" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
          <div
            style={{
              background: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.1))",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981", marginBottom: 12 }}>
              Check Your Email
            </div>
            <div style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
              We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
              Didn't receive it? Check your spam folder or try again.
            </div>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              style={{
                width: "100%",
                padding: 14,
                background: "linear-gradient(135deg,#10B981,#059669)",
                border: "none",
                borderRadius: 10,
                color: "#FFFFFF",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="content-wrapper" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }}>Reset Password</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>Enter your email to receive a reset link</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: 12,
                color: "#FCA5A5",
                fontSize: 13
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="login-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 14,
              background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg,#3B82F6,#2563EB)",
              border: "none",
              borderRadius: 10,
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              marginTop: 8
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => onNavigate("login")}
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
