import React, { useState } from "react";

export default function ResetPassword({ onNavigate, token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
              Password Reset Successfully
            </div>
            <div style={{ color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Your password has been updated. You can now login with your new password.
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
              Go to Login
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
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }}>Create New Password</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>Enter your new password below</div>
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
              New Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                disabled={loading}
                style={{ paddingRight: 45 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 20,
                  color: '#94A3B8',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                disabled={loading}
                style={{ paddingRight: 45 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 20,
                  color: '#94A3B8',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
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
            {loading ? "Resetting..." : "Reset Password"}
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
