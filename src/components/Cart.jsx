import React, { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import { getCart, clearCart } from "../utils/cartStore";
import { useStore } from "../context/StoreContext";
import { useNotifications } from "../context/NotificationsContext";
import { getDefaultPaymentStatus, getEstimatedDeliveryDate } from "../utils/orderStatus";
import { getWalletSummary, ensureWallet, debitWallet } from "../utils/walletStore";
import { API_BASE } from "../utils/api";
import { resolveAssetPath } from "../utils/assetPath";

const PAYMENT_METHODS = [
  "Online Payment",
  "Wallet",
  "Cash on Delivery",
  "Pay on Delivery",
];

const CART_GALLERY_IMAGES = [
  '/images/p1.jpg',
  '/images/p3.jpg',
  '/images/p4.jpg',
  '/images/p5.jpg',
  '/images/mp17.jpg',
  '/images/mp16.jpg',
  '/images/mp15.jpg',
  '/images/mp14.jpg',
  '/images/mp12.jpg',
  '/images/mp10.jpg',
  '/images/mp8.jpg',
  '/images/mp6.jpg',
  '/images/mp5.jpg',
  '/images/mp3.jpg',
  '/images/mp2.jpg',
  '/images/mp1.jpg',
  '/images/light1.webp',
  '/images/light2.webp',
  '/images/fan.png',
  '/images/f17.jpg',
  '/images/f16.jpg',
  '/images/f15.jpg',
  '/images/f14.jpg',
  '/images/f13.jpg',
  '/images/f12.jpg',
  '/images/f11.jpg',
  '/images/f10.jpg',
  '/images/f9.jpg',
  '/images/f7.jpg',
  '/images/f6.jpg',
  '/images/f5.jpg',
  '/images/f4.jpg',
  '/images/f3.jpg',
  '/images/f2.webp',
];

export default function Cart({ activePage, onNavigate, onToggleChat, storedAccount }) {
  const [cart, setCart] = useState(getCart());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { placeOrder } = useStore();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load saved addresses from localStorage
    const stored = localStorage.getItem("userAddresses");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedAddresses(parsed);
        // Set default address as selected
        const defaultAddr = parsed.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (parsed.length > 0) {
          setSelectedAddressId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading addresses:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const total = cart.reduce((s, p) => s + (parseFloat((p.price || "0").toString().replace(/[^0-9.-]+/g, "")) || 0) * p.qty, 0);
  const walletSummary = useMemo(() => {
    if (!storedAccount?.id) return null;
    ensureWallet(storedAccount.id);
    return getWalletSummary(storedAccount.id);
  }, [storedAccount, cart]);

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      return alert("Cart is empty");
    }

    if (!storedAccount?.email) {
      return alert("Please login or provide an email address");
    }

    if (!selectedAddressId) {
      return alert("Please select a delivery address");
    }

    const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);
    const deliveryAddress = selectedAddr 
      ? `${selectedAddr.label}\n${selectedAddr.location?.displayText || ""}\n${selectedAddr.details}`
      : (storedAccount?.address || "");

    try {
      // Generate order ID
      const orderId = `ITEC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const orderData = {
        orderId,
        buyerId: storedAccount?.id || "guest",
        buyerName: storedAccount?.name || "Guest",
        customerName: storedAccount?.name || "Guest",
        email: storedAccount?.email || "",
        phone: storedAccount?.phone || "",
        address: deliveryAddress,
        addressId: selectedAddressId,
        image: storedAccount?.image || "",
        items: cart,
        total: total,
        paymentMethod,
        orderNote: notes,
      };

      // Handle different payment methods
      if (paymentMethod === "Online Payment") {
        clearCart();
        setCart([]);
        onNavigate("payment-page", orderData);
        return;
      }

      if (paymentMethod === "Wallet") {
        if (!walletSummary) {
          addNotification({
            title: 'Wallet unavailable',
            message: 'Please login and ensure your wallet is initialized.',
            type: 'warning'
          });
          return;
        }

        if (walletSummary.balance < total) {
          addNotification({
            title: 'Insufficient wallet balance',
            message: `Your wallet balance is $${walletSummary.balance.toFixed(2)}. Please fund your wallet or choose another payment method.`,
            type: 'warning'
          });
          onNavigate('wallet');
          return;
        }

        const orderResult = await placeOrder({
          ...orderData,
          status: 'confirmed',
          paymentStatus: 'paid',
          transactionRef: `WALLET-${Date.now()}`,
        });

        debitWallet(storedAccount.id, total, {
          title: 'Wallet payment for order',
          description: `Payment for order ${orderId}`,
          category: 'wallet_payment',
          relatedOrderId: orderId,
        });

        clearCart();
        setCart([]);

        addNotification({
          title: `Order #${orderId} Paid from Wallet`,
          message: `Your wallet payment of $${total.toFixed(2)} was successful.`,
          type: 'success'
        });

        if (onNavigate) {
          onNavigate('payment-success', { orderId, paymentMethod, ...orderData, status: 'confirmed' });
        } else {
          window.location.href = `/payment-success?orderId=${orderId}`;
        }

        return;
      }

      const response = await fetch(`${API_BASE}/api/payments/offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerEmail: storedAccount?.email,
          customerName: storedAccount?.name || "Guest",
          amount: total,
          paymentMethod,
          items: cart,
          address: deliveryAddress,
          addressId: selectedAddressId,
          phone: storedAccount?.phone || ""
        })
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        setCart([]);
        
        localStorage.setItem('lastOrder', JSON.stringify({
          ...orderData,
          orderNote: notes,
          status: 'pending',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }));

        addNotification({
          title: `Order #${orderId} Placed Successfully`,
          message: `Your ${paymentMethod} order has been placed. Total: $${total.toFixed(2)}`,
          type: 'success'
        });

        if (onNavigate) {
          onNavigate('payment-success', { orderId, offline: true, ...orderData });
        } else {
          window.location.href = `/payment-success?orderId=${orderId}&offline=true`;
        }
      } else {
        addNotification({
          title: 'Order Failed',
          message: data.message || 'Failed to place order',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      addNotification({
        title: 'Error',
        message: err.message || 'Checkout failed. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>Your Cart</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="button" className="chat-toggle" onClick={onToggleChat}>💬</button>
            <div style={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => onNavigate("home")}>Continue Shopping</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map((item, idx) => {
            const itemImage = resolveAssetPath(item.image || CART_GALLERY_IMAGES[idx % CART_GALLERY_IMAGES.length]);
            return (
              <div key={item.id ?? idx} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden', background: '#0B1220' }}>
                  <img
                    src={itemImage}
                    alt={item.title || 'Cart item'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = resolveAssetPath('/images/p1.jpg'); }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{item.title}</div>
                  <div style={{ color: "#94A3B8", fontSize: 13 }}>{item.qty} × {item.price}</div>
                </div>
                <div style={{ fontWeight: 800 }}>{item.price}</div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: 18, padding: 10, minHeight: "auto" }}>
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Delivery Address</div>
          {savedAddresses.length > 0 ? (
            <div style={{ display: "grid", gap: 6, marginBottom: 4 }}>
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    padding: 8,
                    background: selectedAddressId === addr.id 
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: selectedAddressId === addr.id
                      ? "2px solid #3B82F6"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <input
                      type="radio"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      style={{ cursor: "pointer" }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                        {addr.label} {addr.isDefault && <span style={{ fontSize: 10, color: "#22C55E" }}>✓ Default</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>📍 {addr.location?.displayText}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#D1D5DB", whiteSpace: "pre-wrap", marginLeft: 24 }}>
                    {addr.details}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: 8, 
              background: "rgba(255, 255, 255, 0.04)", 
              borderRadius: 10, 
              color: "#94A3B8",
              marginBottom: 8,
              textAlign: "center"
            }}>
              <p>No addresses saved. <button 
                type="button"
                onClick={() => onNavigate("profile-addresses")}
                style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontWeight: 600 }}
              >
                Add one now
              </button></p>
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: 18, padding: 16, minHeight: "auto" }}>
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Payment & Delivery</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={{ color: "#94A3B8", marginBottom: 6 }}>Choose payment method</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`category ${paymentMethod === method ? "category-active" : ""}`}
                    onClick={() => setPaymentMethod(method)}
                    style={{ minWidth: 140 }}
                  >
                    {method}
                  </button>
                ))}
              </div>
              {paymentMethod === "Wallet" && (
                <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div>
                      <div style={{ color: "#94A3B8", fontSize: 12 }}>Wallet balance</div>
                      <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 18 }}>${walletSummary?.balance?.toFixed(2) ?? "0.00"}</div>
                    </div>
                    <div style={{ color: walletSummary?.balance >= total ? "#22C55E" : "#F97316", fontWeight: 700 }}>
                      {walletSummary?.balance >= total ? "Sufficient" : "Insufficient"}
                    </div>
                  </div>
                  {!walletSummary && (
                    <div style={{ marginTop: 10, color: "#FBBF24" }}>
                      Please login and visit your wallet page to initialize your wallet.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label style={{ color: "#94A3B8", display: "block", marginBottom: 8 }}>Order note</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add delivery instructions or order notes"
                style={{ width: "100%", minHeight: 80, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "var(--surface)", color: "var(--text)", padding: 12 }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#94A3B8" }}>Estimated delivery</div>
                <div style={{ fontWeight: 700, color: "var(--text)" }}>{getEstimatedDeliveryDate(new Date().toISOString())}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#94A3B8" }}>Order total</div>
                <div style={{ fontWeight: 900, fontSize: 22, color: "var(--text)" }}>${total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" style={{ width: "100%" }} onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
      <BottomNav active={activePage} onNavigate={onNavigate} />
    </div>
  );
}
