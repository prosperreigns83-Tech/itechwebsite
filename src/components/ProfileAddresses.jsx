import React, { useState, useEffect } from "react";
import BottomNav from "./BottomNav";
import LocationSearch from "./LocationSearch";

export default function ProfileAddresses({ onNavigate, addresses = [], onUpdateAddresses, address = "", onUpdateAddress }) {
  const [savedAddresses, setSavedAddresses] = useState(addresses && Array.isArray(addresses) ? addresses : []);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [label, setLabel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [defaultId, setDefaultId] = useState(savedAddresses.length > 0 ? savedAddresses[0].id : null);

  // Load addresses from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("userAddresses");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedAddresses(parsed);
        if (parsed.length > 0) {
          setDefaultId(parsed.find(a => a.isDefault)?.id || parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading addresses:", e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!newAddress.trim() || !label.trim()) {
      alert("Please enter both address label and details");
      return;
    }

    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    if (editingId) {
      // Update existing address
      const updated = savedAddresses.map(a => 
        a.id === editingId 
          ? { ...a, label, details: newAddress, location: selectedLocation, isDefault: a.id === defaultId }
          : a
      );
      setSavedAddresses(updated);
    } else {
      // Add new address
      const newAddr = {
        id: Date.now().toString(),
        label,
        details: newAddress,
        location: selectedLocation,
        isDefault: savedAddresses.length === 0 || defaultId === null
      };
      setSavedAddresses([...savedAddresses, newAddr]);
    }

    // Save to localStorage
    const allAddrs = editingId 
      ? savedAddresses.map(a => a.id === editingId 
          ? { ...a, label, details: newAddress, location: selectedLocation, isDefault: a.id === defaultId }
          : a)
      : [...savedAddresses, { id: Date.now().toString(), label, details: newAddress, location: selectedLocation, isDefault: savedAddresses.length === 0 }];
    
    localStorage.setItem("userAddresses", JSON.stringify(allAddrs));

    // Also update parent component
    if (onUpdateAddresses) onUpdateAddresses(allAddrs);
    
    // Reset form
    setEditing(false);
    setEditingId(null);
    setNewAddress("");
    setLabel("");
    setSelectedLocation(null);
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setNewAddress(addr.details);
    setSelectedLocation(addr.location);
    setEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this address?")) {
      const updated = savedAddresses.filter(a => a.id !== id);
      setSavedAddresses(updated);
      localStorage.setItem("userAddresses", JSON.stringify(updated));
      if (onUpdateAddresses) onUpdateAddresses(updated);
      if (defaultId === id) {
        setDefaultId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const handleSetDefault = (id) => {
    setDefaultId(id);
    const updated = savedAddresses.map(a => ({ ...a, isDefault: a.id === id }));
    setSavedAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    if (onUpdateAddresses) onUpdateAddresses(updated);
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
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>Delivery Addresses</div>
          <div style={{ width: 24 }} />
        </div>

        {/* Address Content */}
        <div style={{ padding: "16px 18px" }}>
          {editing ? (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 14,
                display: "grid",
                gap: 10,
                marginBottom: 16
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: 8, color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>
                  Address Label (e.g., Home, Work, Office)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter label"
                  className="login-input"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>
                  Search Location
                </label>
                <LocationSearch 
                  onLocationSelect={setSelectedLocation}
                  initialValue={selectedLocation ? selectedLocation.displayText : ""}
                />
                {selectedLocation && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#60A5FA" }}>
                    ✓ {selectedLocation.displayText} selected
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>
                  Full Address Details
                </label>
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter street address, apartment number, etc..."
                  className="login-input"
                  rows={4}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditingId(null);
                    setNewAddress("");
                    setLabel("");
                    setSelectedLocation(null);
                  }}
                  style={{
                    padding: "10px",
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
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: "10px",
                    background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                    border: "none",
                    borderRadius: 10,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {savedAddresses.length > 0 ? (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 12 }}>
                    📍 Saved Addresses ({savedAddresses.length})
                  </div>
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        background: addr.isDefault 
                          ? "linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.08))"
                          : "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,255,0.08))",
                        border: addr.isDefault 
                          ? "1px solid rgba(34,197,94,0.25)"
                          : "1px solid rgba(59,130,246,0.25)",
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 12
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>
                            {addr.label}
                            {addr.isDefault && <span style={{ fontSize: 11, color: "#22C55E", marginLeft: 8 }}>✓ Default</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>
                            📍 {addr.location?.displayText || "Location"}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: 13, color: "#FFFFFF", lineHeight: 1.6, marginBottom: 12, whiteSpace: "pre-wrap" }}>
                        {addr.details}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            style={{
                              padding: "6px 10px",
                              background: "rgba(34,197,94,0.15)",
                              border: "1px solid rgba(34,197,94,0.3)",
                              borderRadius: 8,
                              color: "#22C55E",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(addr)}
                          style={{
                            padding: "6px 10px",
                            background: "rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.3)",
                            borderRadius: 8,
                            color: "#60A5FA",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(addr.id)}
                          style={{
                            padding: "6px 10px",
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 8,
                            color: "#EF4444",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 18px",
                    color: "var(--muted)",
                    marginBottom: 16
                  }}
                >
                  <div style={{ fontSize: 14, marginBottom: 12 }}>No addresses saved yet</div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setNewAddress("");
                  setLabel("");
                  setSelectedLocation(null);
                  setEditingId(null);
                  setEditing(true);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                  border: "none",
                  borderRadius: 10,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                + Add New Address
              </button>
            </>
          )}
        </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
