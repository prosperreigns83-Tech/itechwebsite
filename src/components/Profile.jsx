import React, { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import ToggleMenu from "./ToggleMenu";
import { createOrder } from "../utils/api";
import { useNotifications } from "../context/NotificationsContext";
import { getWalletSummary } from "../utils/walletStore";

export default function Profile({ activePage, onNavigate, onToggleChat, profileData, onUpdateProfile, onLogout, theme, onThemeChange }){
  const [name, setName] = useState(profileData?.name || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [username, setUsername] = useState(profileData?.username || "");
  const [imageUrl, setImageUrl] = useState(profileData?.image || "");
  const [preview, setPreview] = useState(profileData?.image || "");
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretTimer, setSecretTimer] = useState(null);
  const [sellerMenuOpen, setSellerMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (profileData) {
      setName(profileData.name || "");
      setEmail(profileData.email || "");
      setUsername(profileData.username || "");
      setImageUrl(profileData.image || "");
      setPreview(profileData.image || "");
    }
  }, [profileData]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImageUrl(url);
  };

  const handleAvatarClick = () => {
    setSecretClicks((current) => {
      const next = current + 1;
      if (secretTimer) {
        clearTimeout(secretTimer);
      }
      const timer = setTimeout(() => setSecretClicks(0), 1200);
      setSecretTimer(timer);

      if (next >= 7) {
        setSecretClicks(0);
        clearTimeout(timer);
        onNavigate("admin-login");
      }
      return next;
    });
  };

  const walletSummary = useMemo(() => getWalletSummary(profileData?.id), [profileData]);

  const accountMenuItems = [
    { label: 'Notifications', action: 'notifications', icon: '🔔', badge: unreadCount },
    { label: 'My Wallet', action: 'wallet', icon: '👛' },
    { label: 'Courses', action: 'courses', icon: '🎓' },
    { label: 'My Orders', action: 'profile-orders', icon: '📦' },
    { label: 'Invoice History', action: 'history', icon: '📑' },
    { label: 'Order Receipts', action: 'payment-success', icon: '🧾' },
    { label: 'Payment Methods', action: 'profile-payment', icon: '💳' },
    { label: 'Addresses', action: 'profile-addresses', icon: '📍' },
    { label: 'Settings', action: 'profile-settings', icon: '⚙️' },
    { label: 'Edit Profile', action: 'profile-edit', icon: '✏️' },
  ];

  const handleMenuClick = (item) => {
    onNavigate(item.action);
  };

  return (
    <div className="app-shell">
      <div className="premium-profile">
        <div className="content-wrapper">
        
        {/* Header with Icons */}
        <div className="profile-header">
          <button type="button" className="icon-btn" style={{fontSize:'18px',background:'none',border:'none',color:'var(--text)',cursor:'pointer'}}>☰</button>
          <div style={{fontWeight:700,fontSize:14,color:'var(--muted)'}}>Profile</div>
          <button type="button" className="icon-btn" style={{fontSize:'18px',background:'none',border:'none',color:'var(--text)',cursor:'pointer'}} onClick={onToggleChat}>💬</button>
        </div>

        {profileData ? (
          <>
            {/* Premium Profile Header */}
            <div className="profile-hero">
              {/* Avatar Section with Glow */}
              <div style={{position:'relative',display:'inline-block',marginBottom:20}}>
                <div 
                  className="avatar-premium"
                  onClick={handleAvatarClick} 
                  style={{
                    backgroundImage:`url(${preview || imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'})`,
                    cursor:'pointer',
                    width:110,
                    height:110,
                    borderRadius:'50%',
                    backgroundSize:'cover',
                    backgroundPosition:'center',
                    border:'3px solid rgba(59,130,246,0.4)',
                    boxShadow:'0 0 24px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)'
                  }} 
                />
                <button className="edit-avatar-btn" style={{position:'absolute',bottom:0,right:0,width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#3B82F6,#2563EB)',border:'none',color:'#FFFFFF',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(59,130,246,0.4)'}} onClick={() => onNavigate('profile-edit')}>
                  ✏️
                </button>
              </div>

              {/* User Info */}
              <h1 style={{fontSize:22,fontWeight:800,color:'var(--text)',margin:0,marginBottom:6}}>{name || 'Your Name'}</h1>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                <span style={{color:'var(--muted)',fontSize:13}}>@{username || 'username'}</span>
                {profileData?.role === 'seller' && (
                  <span style={{fontSize:11,background:'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(37,99,255,0.1))',color:'#60A5FA',padding:'4px 10px',borderRadius:14,fontWeight:600,border:'1px solid rgba(59,130,246,0.3)'}}>✓ Seller</span>
                )}
              </div>
              <div style={{color:'var(--muted)',fontSize:12}}>{email || 'you@example.com'}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 18 }}>
              <div style={{ padding: 16, borderRadius: 24, background: 'var(--glass-bg)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 6 }}>Wallet balance</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{walletSummary?.currency} {walletSummary?.balance?.toLocaleString()}</div>
                  </div>
                  <button className="btn-primary" style={{ minWidth: 160 }} onClick={() => onNavigate('wallet')}>
                    View Wallet
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
                  <div style={{ flex: 1, minWidth: 150, padding: 12, borderRadius: 16, background: 'rgba(59,130,246,0.08)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Total credits</div>
                    <div style={{ fontWeight: 700, color: '#10B981', marginTop: 6 }}>{walletSummary?.totalCredits.toLocaleString()}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 150, padding: 12, borderRadius: 16, background: 'var(--glass-bg)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Total debits</div>
                    <div style={{ fontWeight: 700, color: '#EF4444', marginTop: 6 }}>{walletSummary?.totalDebits.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="profile-stat-grid">
              <div className="stat-card" style={{padding:12,background:'rgba(59,130,246,0.08)',borderRadius:12,border:'1px solid rgba(59,130,246,0.2)',textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#60A5FA'}}>5</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>Orders</div>
              </div>
              <div className="stat-card" style={{padding:12,background:'rgba(59,130,246,0.08)',borderRadius:12,border:'1px solid rgba(59,130,246,0.2)',textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#60A5FA'}}>12</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>Wishlist</div>
              </div>
              <div className="stat-card" style={{padding:12,background:'rgba(59,130,246,0.08)',borderRadius:12,border:'1px solid rgba(59,130,246,0.2)',textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:'#60A5FA'}}>4.8</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>Reviews</div>
              </div>
            </div>

            {/* Quick Actions (View Receipt / Orders) */}
            <div className="profile-action-row" style={{display:'flex',gap:12,justifyContent:'center',margin:'16px 0'}}>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const payload = {
                      customerName: name || 'Demo User',
                      email: email || 'demo@itech.test',
                      phone: profileData?.phone || '+2348000000000',
                      address: profileData?.address || 'Demo Address',
                      deliveryMethod: profileData?.address ? 'Standard Delivery' : 'Pickup',
                      items: [
                        { name: 'Sample Product', specs: 'Demo Specs', qty: 1, price: 1000, total: 1000 }
                      ],
                      subtotal: 1000,
                      deliveryFee: 200,
                      discount: 0,
                      tax: 0,
                      total: 1200
                    };
                    const resp = await createOrder(payload);
                    const navigationPayload = {
                      ...payload,
                      orderId: resp?.order?.orderId || resp?.orderId || resp?.referenceId,
                      referenceId: resp?.order?.referenceId || resp?.referenceId,
                      orderDate: new Date().toISOString(),
                      paymentStatus: 'Paid'
                    };
                    
                    // Save order to localStorage for invoice history
                    const existing = JSON.parse(localStorage.getItem('itechInvoices') || '[]');
                    existing.unshift(navigationPayload);
                    localStorage.setItem('itechInvoices', JSON.stringify(existing));
                    
                    onNavigate('payment-success', navigationPayload);
                  } catch (err) {
                    console.error('Create order failed', err);
                    onNavigate('payment-success', {
                      customerName: name || 'Demo User',
                      email: email || 'demo@itech.test',
                      address: profileData?.address || 'Demo Address',
                      deliveryMethod: profileData?.address ? 'Standard Delivery' : 'Pickup',
                      items: [
                        { name: 'Sample Product', specs: 'Demo Specs', qty: 1, price: 1000, total: 1000 }
                      ],
                      subtotal: 1000,
                      deliveryFee: 200,
                      discount: 0,
                      tax: 0,
                      total: 1200
                    });
                  }
                }}
                className="profile-primary-btn"
                style={{padding:'12px 20px',borderRadius:12,background:'linear-gradient(135deg,#1d4ed8,#2563ff)',border:'none',color:'#fff',fontWeight:700,cursor:'pointer',boxShadow:'0 8px 20px rgba(37,99,255,0.12)'}}
              >
                View Sample Receipt
              </button>
              <button
                type="button"
                onClick={() => onNavigate('profile-orders')}
                className="profile-secondary-btn"
                style={{padding:'12px 18px',borderRadius:12,background:'var(--glass-bg)',border:'1px solid var(--border)',color:'var(--text)',cursor:'pointer'}}
              >
                My Orders
              </button>
            </div>
            {/* Account Menu Cards */}
            <div className="profile-menu-grid">
                {accountMenuItems.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    className="premium-menu-card"
                    onClick={() => handleMenuClick(item)}
                    style={{position: 'relative'}}
                  >
                    <div style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'var(--glass-bg)',borderRadius:12,fontSize:20,position:'relative'}}>
                      {item.icon}
                      {item.badge > 0 && (
                        <div style={{position:'absolute',top:-4,right:-4,background:'#EF4444',color:'white',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800}}>
                          {item.badge}
                        </div>
                      )}
                    </div>
                    <div style={{textAlign:'left',flex:1,marginLeft:8}}>
                      <div style={{fontSize:15,fontWeight:700,color:'var(--text)'}}>{item.label}</div>
                      <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>Manage</div>
                    </div>
                    <div style={{fontSize:16,color:'var(--muted)'}}>›</div>
                  </button>
                ))}
            </div>

            {/* Seller Analytics Dashboard */}
            {profileData?.role === 'seller' && (
              <div className="profile-seller-grid-wrapper">
                <div className="profile-seller-panel">
                  <div style={{fontWeight:700,fontSize:14,color:'var(--text)',marginBottom:14}}>📊 Seller Dashboard</div>
                  <div className="profile-seller-grid">
                    <div style={{padding:12,background:'rgba(59,130,246,0.15)',borderRadius:10,border:'1px solid rgba(59,130,246,0.2)'}}>
                      <div style={{fontSize:18,fontWeight:800,color:'#60A5FA'}}>8</div>
                      <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Products</div>
                    </div>
                    <div style={{padding:12,background:'rgba(59,130,246,0.15)',borderRadius:10,border:'1px solid rgba(59,130,246,0.2)'}}>
                      <div style={{fontSize:18,fontWeight:800,color:'#60A5FA'}}>$1.2k</div>
                      <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Earnings</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSellerMenuOpen(true)} className="profile-cta-button">
                    Manage Store
                  </button>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="profile-logout-wrap">
              <button type="button" onClick={onLogout} className="profile-logout-button">
                🚪 Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{padding:'32px 18px',textAlign:'center',color:'var(--muted)'}}>
            Please log in first to view your profile.
          </div>
        )}
        </div>
      </div>

      {/* Seller Menu */}
      <ToggleMenu
        open={sellerMenuOpen}
        title="Seller Menu"
        onClose={() => setSellerMenuOpen(false)}
        items={[
          { label: 'Overview', onClick: () => { onNavigate('seller-dashboard', 'overview'); setSellerMenuOpen(false); } },
          { label: 'Add Product', onClick: () => { onNavigate('seller-dashboard', 'add'); setSellerMenuOpen(false); } },
          { label: 'My Products', onClick: () => { onNavigate('seller-dashboard', 'products'); setSellerMenuOpen(false); } },
          { label: 'Orders', onClick: () => { onNavigate('seller-dashboard', 'orders'); setSellerMenuOpen(false); } },
          { label: 'Go to Shop', onClick: () => { onNavigate('home'); setSellerMenuOpen(false); }, style: { background: '#0B1220', color: '#94A3B8' } },
        ]}
      />

      <BottomNav active={activePage} onNavigate={onNavigate} />
    </div>
  );
}

