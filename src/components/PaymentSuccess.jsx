import React, { useState, useEffect, useRef } from "react";
import BottomNav from "./BottomNav";
import html2pdf from "html2pdf.js";
import { API_BASE, getOrder } from "../utils/api";
import { resolveAssetPath } from "../utils/assetPath";

export default function PaymentSuccess({ onNavigate, orderData = null }) {
  const [copied, setCopied] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [order, setOrder] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const invoiceRef = useRef(null);
  
  // Get URL search params without React Router, including values inside the hash fragment
  const getSearchParam = (param) => {
    const url = new URL(window.location.href);
    const searchValue = url.searchParams.get(param);
    if (searchValue) return searchValue;

    const hash = window.location.hash || '';
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const hashParams = new URLSearchParams(hash.substring(queryIndex + 1));
      return hashParams.get(param);
    }

    return null;
  };

  // Get user account from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itechUserAccount");
      if (saved) {
        setUserAccount(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load user account:', error);
    }
  }, []);

  // Verify payment if coming from Paystack redirect
  useEffect(() => {
    const reference = getSearchParam('reference');
    
    if (reference) {
      verifyPaystackPayment(reference);
    }
  }, []);

  const verifyPaystackPayment = async (reference) => {
    setVerifying(true);
    try {
      const response = await fetch(`${API_BASE}/api/payments/verify/${reference}`);
      const data = await response.json();

      if (data.success) {
        if (data.data?.type === 'wallet_funding') {
          setOrder({
            orderId: `WALLET-${data.data.userId || 'UNKNOWN'}`,
            referenceId: reference,
            orderDate: new Date().toLocaleDateString(),
            paymentDate: new Date().toLocaleDateString(),
            paymentMethod: 'Wallet Funding',
            paymentStatus: 'Wallet Credited',
            orderStatus: 'Funding Completed',
            customerName: userAccount?.name || 'Customer',
            email: userAccount?.email || data.data?.customer?.email || '',
            phone: userAccount?.phone || '',
            address: userAccount?.address || '',
            image: userAccount?.image || '',
            deliveryMethod: 'Wallet top-up',
            items: [],
            subtotal: data.data?.amount || 0,
            deliveryFee: 0,
            discount: 0,
            tax: 0,
            total: data.data?.amount || 0,
            savings: 0,
            timeline: [
              { step: 'Wallet funded', date: new Date().toISOString(), status: 'completed' }
            ]
          });
          return;
        }

        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
        let fetchedOrder = null;

        if (data.data?.orderId) {
          try {
            const resp = await getOrder(data.data.orderId);
            fetchedOrder = resp?.order || null;
          } catch (fetchErr) {
            console.warn('Could not fetch order details after verification:', fetchErr);
          }
        }

        const source = fetchedOrder || lastOrder;
        setOrder({
          ...source,
          orderId: data.data.orderId || source.orderId,
          referenceId: reference,
          paymentStatus: 'Payment Confirmed',
          paymentDate: new Date().toLocaleDateString()
        });
      } else {
        console.error('Payment verification failed:', data.message);
        // Fall back to stored order
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
        if (lastOrder.orderId) {
          setOrder(lastOrder);
        }
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      // Fall back to stored order
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
      if (lastOrder.orderId) {
        setOrder(lastOrder);
      }
    } finally {
      setVerifying(false);
    }
  };

  // Load order data
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Priority: orderData (explicit) > lastOrder (localStorage) > API fetch
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
        const reference = getSearchParam('reference');
        
        // If orderData is explicitly passed, use it first
        if (orderData) {
          if (!mounted) return;
          
          const payload = typeof orderData === 'object' ? orderData : null;
          if (!payload) return;
          
          const id = orderData?.orderId || orderData?.referenceId;
          
          // Try to fetch full order details from API if we have an ID
          let fetched = null;
          if (id) {
            try {
              const resp = await getOrder(id);
              fetched = resp?.order || null;
            } catch (err) {
              console.warn('Could not fetch order details from API, using provided data:', err);
            }
          }

          const source = fetched || payload;
          const o = fetched || {
            orderId: source.orderId,
            referenceId: source.referenceId,
            status: source.paymentStatus || source.orderStatus || 'Payment Received'
          };
          const data = (fetched && fetched.data) ? fetched.data : source;

          if (!mounted) return;

          setOrder({
            orderId: o.orderId || data.orderId || id || 'N/A',
            referenceId: o.referenceId || data.referenceId || id || 'N/A',
            orderDate: data.orderDate || new Date().toLocaleDateString(),
            paymentDate: data.paymentDate || new Date().toLocaleDateString(),
            paymentMethod: data.paymentMethod || 'Online Payment',
            paymentStatus: o.status || data.paymentStatus || 'Payment Received',
            orderStatus: data.orderStatus || 'Order Confirmed',
            customerName: data.customerName || data.buyerName || userAccount?.name || 'Customer',
            email: data.email || userAccount?.email || '',
            phone: data.phone || userAccount?.phone || '',
            address: data.address || userAccount?.address || '',
            image: data.image || userAccount?.image || '',
            deliveryMethod: data.deliveryMethod || data.estimatedDelivery || '',
            items: data.items || [],
            subtotal: data.subtotal || 0,
            deliveryFee: data.deliveryFee || 0,
            discount: data.discount || 0,
            tax: data.tax || 0,
            total: data.total || 0,
            savings: data.savings || 0,
            timeline: (fetched && fetched.timeline) || data.timeline || []
          });
          return;
        }

        // If no orderData, check for lastOrder from localStorage
        if (lastOrder.orderId && !reference) {
          if (!mounted) return;
          
          setOrder({
            ...lastOrder,
            paymentStatus: lastOrder.paymentStatus || 'Order Confirmed',
            paymentDate: new Date().toLocaleDateString()
          });
          return;
        }

        // If we have a Paystack reference, verification already handled it
        // No need to do anything else here
      } catch (err) {
        console.error('Failed to load order', err);
      }
    }
    load();
    return () => { mounted = false; };
  }, [orderData, userAccount]);

  // fallback uses actual user data if available
  const fallbackOrder = {
    orderId: "ITEC-2024-000123",
    referenceId: "REF-PSK-8923748923",
    orderDate: new Date().toLocaleDateString(),
    paymentDate: new Date().toLocaleDateString(),
    paymentMethod: "Online Payment",
    paymentStatus: "Payment Received",
    orderStatus: "Order Confirmed",
    customerName: userAccount?.name || "Customer",
    email: userAccount?.email || "",
    phone: userAccount?.phone || "",
    address: userAccount?.address || "",
    image: userAccount?.image || "",
    deliveryMethod: "Express Delivery (1-2 working days)",
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    tax: 0,
    total: 0,
    savings: 0,
    timeline: []
  };

  const displayOrder = order || fallbackOrder;

  const parseNumber = (value) => {
    if (value == null || value === '') return 0;
    if (typeof value === 'number') return value;
    const cleaned = value.toString().replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const normalizeItem = (item) => {
    const qty = item.qty || item.quantity || 1;
    const price = parseNumber(item.price || item.unitPrice || 0);
    return {
      ...item,
      name: item.name || item.title || item.productName || item.label || 'Product',
      specs: item.specs || item.description || item.details || '—',
      qty,
      price,
      total: parseNumber(item.total != null ? item.total : qty * price)
    };
  };

  const invoiceItems = (displayOrder.items || []).map(normalizeItem);
  const invoiceSubtotal = parseNumber(displayOrder.subtotal) || invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const invoiceDeliveryFee = parseNumber(displayOrder.deliveryFee);
  const invoiceDiscount = parseNumber(displayOrder.discount);
  const invoiceTax = parseNumber(displayOrder.tax);
  const invoiceTotal = parseNumber(displayOrder.total) || invoiceSubtotal + invoiceDeliveryFee + invoiceTax - invoiceDiscount;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
  };

  // Print Receipt Handler — open a focused print window with invoice-only markup
  const handlePrintReceipt = () => {
    if (!invoiceRef.current) return;
    // Prefer the actual invoice card so UI buttons and interactive elements are excluded
    const card = invoiceRef.current.querySelector('.invoice-sheet-card') || document.querySelector('.invoice-sheet-card') || invoiceRef.current;
    const content = card ? card.outerHTML : (invoiceRef.current.innerHTML);
    const styles = `
      body{margin:0;font-family:InterVar, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;background:#fff}
      /* Force readable PDF-friendly text */
      .invoice-sheet-card, .invoice-sheet-card * { color:#000 !important; font-weight:700 !important }
      .invoice-sheet-card{width:820px;margin:24px auto;padding:28px;border-radius:12px;border:1px solid #e6eef9}
      .invoice-sheet-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:18px}
      .invoice-sheet-badge{display:inline-flex;padding:8px 12px;border-radius:999px;background:#2563EB;color:#fff;font-weight:700;font-size:12px}
      .invoice-sheet-header h1{margin:0;font-size:22px}
      .invoice-sheet-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .invoice-sheet-meta-label{font-size:11px;color:#6b7280;text-transform:uppercase}
      .invoice-sheet-meta-value{font-weight:700;color:#111827}
      .invoice-items-table table{width:100%;border-collapse:collapse;margin-top:12px}
      .invoice-items-table th, .invoice-items-table td{padding:10px;border-bottom:1px solid #eef2f7;font-size:13px;color:#374151}
      .invoice-items-table thead th{background:#f8fafc;color:#111827;font-weight:700;text-align:left}
      .invoice-sheet-summary{display:flex;flex-direction:column;gap:8px;margin-top:16px}
      .invoice-sheet-summary div{display:flex;justify-content:space-between;padding:8px 10px;background:#f8fafc;border-radius:8px}
      .invoice-sheet-summary-total{background:#1E40AF;color:#fff;padding:12px;border-radius:8px;font-weight:800}
      .invoice-sheet-footer{margin-top:18px;color:#475569;font-size:13px}
      @media print{ body{background:#fff} }
    `;

    const printWin = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWin) {
      alert('Please allow popups to print the receipt.');
      return;
    }
    printWin.document.write(`<!doctype html><html><head><title>Invoice ${displayOrder.orderId}</title><style>${styles}</style></head><body><div class="invoice-sheet-card">${content}</div></body></html>`);
    printWin.document.close();
    printWin.focus();
    // Give browser a moment to render before printing
    setTimeout(() => {
      try { printWin.print(); } catch (e) { console.error('Print failed', e); }
    }, 300);
  };

  // Download Invoice Handler
  const handleDownloadInvoice = async () => {
    const card = invoiceRef.current?.querySelector('.invoice-sheet-card') || document.querySelector('.invoice-sheet-card');
    if (!card) {
      alert('Invoice content is not available for download.');
      return;
    }

    const clone = card.cloneNode(true);
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.visibility = 'hidden';
    const styleNode = document.createElement('style');
    styleNode.textContent = `
      body { margin: 0; font-family: InterVar, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: #fff; color: #111827; }
      .invoice-sheet-card { width: 820px; margin: 24px auto; padding: 28px; border-radius: 12px; border: 1px solid #e6eef9; background: #fff; color: #111827; }
      .invoice-sheet-card, .invoice-sheet-card * { color: #111827 !important; font-weight: 700 !important; }
      .invoice-sheet-badge { display: inline-flex; padding: 8px 12px; border-radius: 999px; background: #2563EB; color: #fff; font-weight: 700; font-size: 12px; }
      .invoice-sheet-header h1 { margin: 0; font-size: 22px; }
      .invoice-sheet-meta-label { font-size: 11px; color: #6b7280; text-transform: uppercase; }
      .invoice-sheet-meta-value { font-weight: 700; color: #111827; }
      .invoice-items-table table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      .invoice-items-table th, .invoice-items-table td { padding: 10px; border-bottom: 1px solid #eef2f7; font-size: 13px; color: #374151; }
      .invoice-items-table thead th { background: #f8fafc; color: #111827; font-weight: 700; text-align: left; }
      .invoice-sheet-summary { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
      .invoice-sheet-summary div { display: flex; justify-content: space-between; padding: 8px 10px; background: #f8fafc; border-radius: 8px; }
      .invoice-sheet-summary-total { background: #1E40AF; color: #fff; padding: 12px; border-radius: 8px; font-weight: 800; }
      .invoice-sheet-footer { margin-top: 18px; color: #475569; font-size: 13px; }
    `;
    wrapper.appendChild(styleNode);
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `ITECH-Invoice-${displayOrder.orderId || 'receipt'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(wrapper).save();
    } catch (err) {
      console.error('Invoice download failed', err);
      alert('Unable to download invoice. Please try again or use print instead.');
    } finally {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };

  // Continue Shopping Handler
  const handleContinueShopping = () => {
    onNavigate('home');
  };

  // Contact Support Handler
  const handleContactSupport = () => {
    alert('Connecting to support team...\n\nEmail: support@itechstore.com\nPhone: +234 803 234 5678\nWhatsApp: +234 803 234 5678');
  };

  // Edit Customer Handler
  const handleEditCustomer = () => {
    setEditingCustomer(true);
    alert('Redirecting to edit profile page...');
    onNavigate('profile-edit');
  };

  // Sidebar navigation handler
  const handleSidebarNav = (item) => {
    if (item.id !== 'receipts') {
      onNavigate(item.page || item.id);
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: '📊', page: 'home' },
    { id: 'orders', label: 'Orders', icon: '📦', page: 'profile-orders' },
    { id: 'tracking', label: 'Order Tracking', icon: '🚚', page: 'order-tracking' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', page: 'wishlist' },
    { id: 'reviews', label: 'Reviews', icon: '⭐', page: 'profile-edit' },
    { id: 'addresses', label: 'Addresses', icon: '📍', page: 'profile-addresses' },
    { id: 'account', label: 'Account Details', icon: '👤', page: 'profile-edit' },
    { id: 'transactions', label: 'Transactions', icon: '💳', page: 'profile-payment' },
    { id: 'receipts', label: 'Receipts', icon: '🧾', page: 'payment-success', active: true },
    { id: 'notifications', label: 'Notification Settings', icon: '🔔', page: 'profile-settings' }
  ];

  return (
    <div className="app-shell">
      <div className="payment-success-wrapper content-wrapper">
        <div className="invoice-export-sheet" ref={invoiceRef} aria-hidden="true">
          <div className="invoice-sheet-card">
            <div className="invoice-sheet-header">
              <div className="invoice-sheet-brand">
                <div className="invoice-sheet-badge">ITECH STORE</div>
                <h1>Invoice</h1>
                <p>Professional receipt for your order, suitable for accounting and record-keeping.</p>
              </div>
              <div className="invoice-sheet-meta">
                <div>
                  <div className="invoice-sheet-meta-label">Order ID</div>
                  <div className="invoice-sheet-meta-value">{displayOrder.orderId}</div>
                </div>
                <div>
                  <div className="invoice-sheet-meta-label">Reference</div>
                  <div className="invoice-sheet-meta-value">{displayOrder.referenceId}</div>
                </div>
                <div>
                  <div className="invoice-sheet-meta-label">Date</div>
                  <div className="invoice-sheet-meta-value">{displayOrder.orderDate}</div>
                </div>
              </div>
            </div>

            <div className="invoice-sheet-grid">
              <div>
                <div className="invoice-sheet-section-title">Bill To</div>
                <div className="invoice-sheet-text">{displayOrder.customerName}</div>
                <div className="invoice-sheet-text">{displayOrder.address}</div>
                <div className="invoice-sheet-text">{displayOrder.email}</div>
                <div className="invoice-sheet-text">{displayOrder.phone}</div>
              </div>
              <div>
                <div className="invoice-sheet-section-title">Payment Details</div>
                <div className="invoice-sheet-text">Method: {displayOrder.paymentMethod}</div>
                <div className="invoice-sheet-text">Status: {displayOrder.paymentStatus}</div>
                <div className="invoice-sheet-text">Delivery: {displayOrder.deliveryMethod}</div>
              </div>
            </div>

            <div className="invoice-items-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Specs</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="invoice-no-items">No items were recorded for this invoice.</td>
                    </tr>
                  ) : (
                    invoiceItems.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>{item.name}</td>
                        <td>{item.specs || '—'}</td>
                        <td>{item.qty}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="invoice-sheet-summary">
              <div>
                <div className="invoice-sheet-summary-label">Subtotal</div>
                <div className="invoice-sheet-summary-value">{formatCurrency(invoiceSubtotal)}</div>
              </div>
              <div>
                <div className="invoice-sheet-summary-label">Delivery Fee</div>
                <div className="invoice-sheet-summary-value">{formatCurrency(invoiceDeliveryFee)}</div>
              </div>
              <div>
                <div className="invoice-sheet-summary-label">Discount</div>
                <div className="invoice-sheet-summary-value">-{formatCurrency(invoiceDiscount)}</div>
              </div>
              <div>
                <div className="invoice-sheet-summary-label">Tax</div>
                <div className="invoice-sheet-summary-value">{formatCurrency(invoiceTax)}</div>
              </div>
              <div className="invoice-sheet-summary-total">
                <div className="invoice-sheet-summary-label">Total Paid</div>
                <div className="invoice-sheet-summary-value">{formatCurrency(invoiceTotal)}</div>
              </div>
            </div>

            <div className="invoice-sheet-footer">
              <div>Thank you for shopping at ITECH STORE.</div>
              <div>Please keep this invoice for your records. If you need support, contact support@itechstore.com.</div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="payment-sidebar">
          <div className="sidebar-header">
            <div style={{ fontSize: 16, fontWeight: 800, color: '#60A5FA' }}>MY ACCOUNT</div>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSidebarNav(item)}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                style={{ cursor: item.active ? 'default' : 'pointer' }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button onClick={() => onNavigate('profile')} className="sidebar-item logout-btn">
              <span style={{ fontSize: 18 }}>🚪</span>
              <span>Logout</span>
            </button>
          </nav>

          {/* Help Section */}
          <div className="sidebar-help">
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Need Help?</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
              Our support team is here to help you with anything you need.
            </div>
            <button 
              onClick={handleContactSupport}
              className="btn-primary" 
              style={{ width: '100%', fontSize: 12, padding: '10px 12px', cursor: 'pointer' }}
            >
              📞 Contact Support
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="payment-main-content">
          {/* Top Navigation */}
          <div className="payment-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button 
                onClick={() => alert('Search functionality')}
                style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 20, cursor: 'pointer' }}
              >
                🔍
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <button 
                onClick={() => onNavigate('profile-settings')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 18, cursor: 'pointer' }}
              >
                🔔
              </button>
              <button 
                onClick={() => onNavigate('cart')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 18, cursor: 'pointer' }}
              >
                🛒
              </button>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => onNavigate('profile')}>
                JC
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="payment-breadcrumb">
            <span style={{ color: '#60A5FA', cursor: 'pointer' }} onClick={() => onNavigate('home')}>Home</span>
            <span style={{ color: '#94A3B8' }}>/</span>
            <span style={{ color: '#94A3B8', cursor: 'pointer' }} onClick={() => onNavigate('profile-orders')}>Orders</span>
            <span style={{ color: '#94A3B8' }}>/</span>
            <span style={{ color: '#fff' }}>Receipt {displayOrder.orderId}</span>
          </div>

          <div className="invoice-export-wrapper">
            {/* Success Hero Section */}
            <div className="payment-hero">
            <div className="success-checkmark">
              <div style={{ fontSize: 48 }}>✓</div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '16px 0 8px' }}>Payment Received!</h1>
            <p style={{ color: '#94A3B8', fontSize: 14 }}>Thank you! Your payment was successful and your order is confirmed.</p>
            <div className="success-buttons">
              <button 
                onClick={handlePrintReceipt}
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                🖨️ Print Receipt
              </button>
              <button 
                onClick={handleDownloadInvoice}
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                ⬇️ Download Invoice
              </button>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="payment-details-grid">
            <div className="detail-card">
              <div className="detail-label">Order ID</div>
              <div className="detail-value">{displayOrder.orderId}</div>
              <button 
                className="detail-copy-btn"
                onClick={() => copyToClipboard(displayOrder.orderId, 'orderId')}
              >
                {copied === 'orderId' ? '✓' : '📋'}
              </button>
            </div>
            <div className="detail-card">
              <div className="detail-label">Payment Reference ID</div>
              <div className="detail-value">{displayOrder.referenceId}</div>
              <button 
                className="detail-copy-btn"
                onClick={() => copyToClipboard(displayOrder.referenceId, 'refId')}
              >
                {copied === 'refId' ? '✓' : '📋'}
              </button>
            </div>
            <div className="detail-card">
              <div className="detail-label">Order Date</div>
              <div className="detail-value">{displayOrder.orderDate}</div>
            </div>
            <div className="detail-card">
              <div className="detail-label">Payment Date</div>
              <div className="detail-value">{displayOrder.paymentDate}</div>
            </div>
          </div>

          {/* Status Row */}
          <div className="payment-status-row">
            <div className="status-item">
              <span style={{ color: '#94A3B8', fontSize: 12 }}>Payment Method</span>
              <span style={{ fontWeight: 700, color: '#fff', marginTop: 6 }}>💳 {displayOrder.paymentMethod}</span>
            </div>
            <div className="status-item">
              <span style={{ color: '#94A3B8', fontSize: 12 }}>Payment Status</span>
              <span className="badge-success" style={{ marginTop: 6 }}>✓ {displayOrder.paymentStatus}</span>
            </div>
            <div className="status-item">
              <span style={{ color: '#94A3B8', fontSize: 12 }}>Order Status</span>
              <span className="badge-blue" style={{ marginTop: 6 }}>✓ {displayOrder.orderStatus}</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="payment-two-column">
            {/* Customer Details */}
            <div className="payment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>👤 Customer Details</h3>
                <button 
                  onClick={handleEditCustomer}
                  style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                >
                  Edit
                </button>
              </div>
              <div className="customer-details-list">
                {displayOrder.image && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <img 
                      src={resolveAssetPath(displayOrder.image)} 
                      alt={displayOrder.customerName}
                      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #60A5FA' }}
                    />
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label-small">Full Name</span>
                  <span className="detail-value-small">{displayOrder.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-small">Email Address</span>
                  <span className="detail-value-small">{displayOrder.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-small">Phone Number</span>
                  <span className="detail-value-small">{displayOrder.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-small">Delivery Address</span>
                  <span className="detail-value-small">{displayOrder.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-small">Delivery Method</span>
                  <span className="detail-value-small">🚚 {displayOrder.deliveryMethod}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="payment-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>📍 Order Timeline</h3>
              <div className="timeline">
                      {(displayOrder.timeline || []).map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className={`timeline-dot ${item.status}`} />
                    <div className="timeline-content">
                      <div style={{ fontWeight: 700, color: item.status === 'completed' ? '#10B981' : item.status === 'in-progress' ? '#60A5FA' : '#94A3B8' }}>
                        {item.status === 'completed' ? '✓' : item.status === 'in-progress' ? '●' : '○'} {item.step}
                      </div>
                      {item.date && (
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{item.date}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="payment-card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>📦 Order Items</h3>
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Details</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(37,99,255,0.1))',
                            border: '1px solid rgba(59,130,246,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24
                          }}>
                            📱
                          </div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: '#94A3B8' }}>{item.specs}</td>
                      <td style={{ textAlign: 'center' }}>{item.qty}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td style={{ fontWeight: 700, color: '#60A5FA' }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 12, fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
                ✓ All items are original and come with manufacturer warranty.
              </div>
            </div>
          </div>

          {/* Payment Summary & Notes */}
          <div className="payment-summary-grid">
            {/* Summary Card */}
            <div className="payment-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>💰 Payment Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(invoiceSubtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{formatCurrency(invoiceDeliveryFee)}</span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span style={{ color: '#10B981' }}>-{formatCurrency(invoiceDiscount)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>{formatCurrency(invoiceTax)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total Amount Paid</span>
                <span>{formatCurrency(invoiceTotal)}</span>
              </div>
              <div style={{ marginTop: 14, padding: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#10B981' }}>
                ✓ You saved {formatCurrency(parseNumber(displayOrder.savings))} on this order
              </div>
            </div>

            {/* Important Notes */}
            <div className="payment-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>ℹ️ Important Notes</h3>
              <div className="notes-list">
                <div className="note-item">
                  <span style={{ fontSize: 16 }}>📧</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>Confirmation Email</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>You will receive an email confirmation shortly.</div>
                  </div>
                </div>
                <div className="note-item">
                  <span style={{ fontSize: 16 }}>📍</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>Order Tracking</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>You can track your order status in Order Tracking section.</div>
                  </div>
                </div>
                <div className="note-item">
                  <span style={{ fontSize: 16 }}>🧾</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>Keep Your Receipt</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Please keep this receipt for your records.</div>
                  </div>
                </div>
                <div className="note-item">
                  <span style={{ fontSize: 16 }}>💬</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>Need Help?</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Contact our support team.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>

          <div className="payment-footer-buttons">
            <button onClick={handleContinueShopping} className="btn-secondary" style={{ cursor: 'pointer' }}>
              ← Continue Shopping
            </button>
            <button onClick={handleContactSupport} className="btn-primary" style={{ cursor: 'pointer' }}>
              💬 Contact Support
            </button>
          </div>

          {/* Footer Section */}
          <div className="payment-footer">
            <div className="footer-badges">
              <div className="footer-badge">
                <span style={{ fontSize: 18 }}>🔒</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>Secure Payment</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Powered by Paystack</div>
                </div>
              </div>
              <div className="footer-badge">
                <span style={{ fontSize: 18 }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>100% Original</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Genuine Products</div>
                </div>
              </div>
              <div className="footer-badge">
                <span style={{ fontSize: 18 }}>🔄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>Easy Returns</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>7-Day Return Policy</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
              © 2024 ITECH STORE. All rights reserved.
            </div>
          </div>
      </div>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
