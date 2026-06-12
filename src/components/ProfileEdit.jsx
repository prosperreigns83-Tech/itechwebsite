import React, { useState } from "react";
import BottomNav from "./BottomNav";

export default function ProfileEdit({
  onNavigate,
  profileData = {},
  onSave
}) {
  const [name, setName] = useState(profileData.name || "");
  const [email, setEmail] = useState(profileData.email || "");
  const [username, setUsername] = useState(profileData.username || "");
  const [imageUrl, setImageUrl] = useState(profileData.image || "");
  const [preview, setPreview] = useState(profileData.image || "");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageUrl(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email || !username) {
      setError("Please fill in all fields");
      return;
    }
    if (onSave) {
      onSave({
        name,
        email,
        username,
        image: imageUrl || preview || ""
      });
      onNavigate("profile");
    }
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
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>Edit Profile</div>
          <div style={{ width: 24 }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ padding: "16px 18px" }}>
          {/* Avatar Preview */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundImage: `url(${preview || imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "0 auto 14px",
                border: "3px solid rgba(59,130,246,0.4)",
                boxShadow: "0 0 24px rgba(59,130,246,0.3)"
              }}
            />
            <label
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                border: "none",
                borderRadius: 8,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                marginBottom: 16
              }}
            >
              📷 Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label className="login-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="login-input"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="login-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="login-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                placeholder="your_username"
              />
            </div>

            <div>
              <label className="login-label">Image URL (optional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreview(e.target.value);
                }}
                className="login-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8,
                  padding: 10,
                  color: "#FCA5A5",
                  fontSize: 12
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                style={{
                  padding: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "12px",
                  background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                  border: "none",
                  borderRadius: 10,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
