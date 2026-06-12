import React, { useState, useEffect } from "react";

export default function Login({ storedAccount, onLogin, onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("buyer");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (storedAccount) {
      setIsExistingUser(true);
      setEmail(storedAccount.email || "");
      setPreview(storedAccount.image || "");
    }
  }, [storedAccount]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageUrl(url);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (isExistingUser && storedAccount) {
      if (email !== storedAccount.email) {
        setError("No account found for this email.");
        return;
      }
      if (password !== storedAccount.password) {
        setError("Wrong password. Please try again.");
        return;
      }
      onLogin({
        name: storedAccount.name,
        email: storedAccount.email,
        username: storedAccount.username,
        image: storedAccount.image || "",
        role: storedAccount.role || "buyer"
      }, password);
      return;
    }

    if (!name || !username) {
      setError("Please fill in your name and username.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to create an account.");
      return;
    }

    onLogin(
      {
        name,
        email,
        username,
        image: imageUrl || preview || "",
        role
      },
      password
    );
  };

  return (
    <div className="app-shell">
      <div className="home" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>Login</div>
          <div style={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => onNavigate("home")}>Skip</div>
        </div>

        <div className="card glass" style={{ padding: 18, marginTop: 16 }}>
          <div className="login-avatar" style={{ backgroundImage: `url(${preview || imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"})` }} />
          <div style={{ marginTop: 16 }}>
            <label className="login-label">Profile picture URL</label>
            <input
              className="login-input"
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreview(e.target.value);
              }}
            />
            <label className="login-label" style={{ marginTop: 12 }}>Upload image</label>
            <input
              className="login-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isExistingUser ? (
            <>
              <div style={{ marginBottom: 12, color: "#CBD5E1", fontSize: 14 }}>
                Welcome back, {storedAccount?.name || "valued customer"}. Use your password to log in.
              </div>
            </>
          ) : (
            <>
              <label className="login-label">Full name</label>
              <input className="login-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />

              <label className="login-label">Username</label>
              <input className="login-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" />
              <label className="login-label">Account type</label>
              <div style={{display:'flex',gap:8,alignItems:'center',marginTop:6}}>
                <label style={{color:'#CBD5E1'}}><input type="radio" name="role" value="buyer" checked={role==='buyer'} onChange={()=>setRole('buyer')} /> Buyer</label>
                <label style={{color:'#CBD5E1'}}><input type="radio" name="role" value="seller" checked={role==='seller'} onChange={()=>setRole('seller')} /> Seller</label>
              </div>
            </>
          )}

          <label className="login-label">Email address</label>
          <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />

          <label className="login-label">Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          {isExistingUser && (
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60A5FA",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "underline"
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {!isExistingUser && (
            <div style={{ marginTop: 16, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", color: "#CBD5E1" }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: 4, cursor: "pointer" }}
                />
                <span style={{ fontSize: 13, lineHeight: 1.4 }}>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => onNavigate("terms-and-conditions")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#60A5FA",
                      cursor: "pointer",
                      fontWeight: 600,
                      textDecoration: "underline",
                      padding: 0,
                      fontSize: 13
                    }}
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>
              {!termsAccepted && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#FCA5A5" }}>
                  ⓘ You must accept the Terms and Conditions
                </div>
              )}
            </div>
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 18 }}>
            {isExistingUser ? "Sign in" : "Create account & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
