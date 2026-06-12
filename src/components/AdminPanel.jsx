import React, { useEffect, useState } from "react";
import { fetchAllProducts, addProduct, updateProductAPI, deleteProductAPI } from "../utils/productApi";
import { banUser, getUsers } from "../utils/userStore";
import { getOrders, updateOrder } from "../utils/orderStore";
import StatusBadge from "./StatusBadge";
import { getYouTubeThumbnail, isVideoFile } from "../utils/videoUtils";

const EMPTY_FORM = {
  id: null,
  title: "",
  category: "Phones",
  price: "",
  subtitle: "",
  imageUrl: "",
  videoUrl: "",
  duration: "",
  views: "",
  uploaded: "",
  preview: ""
};

export default function AdminPanel({ onNavigate, onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await fetchAllProducts();
        setProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      }
    };
    load();
    const loadOrders = () => setOrders(getOrders());
    loadOrders();
    window.addEventListener('orders-updated', loadOrders);
    return () => {
      window.removeEventListener('orders-updated', loadOrders);
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "videos") {
      return product.videoUrl && product.videoUrl.trim().length > 0;
    }
    return true;
  });

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title || "",
      category: product.category || "Phones",
      price: product.price || "",
      subtitle: product.subtitle || "",
      imageUrl: product.image || "",
      videoUrl: product.videoUrl || "",
      duration: product.duration || "",
      views: product.views || "",
      uploaded: product.uploaded || "",
      preview: product.image || ""
    });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await deleteProductAPI(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title || !form.category) {
      setError("Title and category are required.");
      return;
    }

    const product = {
      category: form.category,
      title: form.title,
      price: form.price || "",
      subtitle: form.subtitle || "",
      image: form.imageUrl || form.preview || "",
      videoUrl: form.videoUrl || "",
      duration: form.duration || "",
      views: form.views || "",
      uploaded: form.uploaded || "",
      source: "local"
    };

    try {
      if (form.id) {
        await updateProductAPI(form.id, product);
        setProducts(products.map(p => p.id === form.id ? { ...p, ...product } : p));
      } else {
        const newProduct = await addProduct(product);
        setProducts([...products, newProduct]);
      }
      setForm(EMPTY_FORM);
      setError("");
    } catch (error) {
      console.error('Failed to save product:', error);
      setError('Failed to save product');
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  return (
    <div className="app-shell">
      <div className="home" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>Admin Panel</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-primary" style={{ background: "#0B1220", color: "#94A3B8" }} onClick={onLogout}>
              Logout
            </button>
            <div style={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => onNavigate("home")}>Home</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ flex: 1, minWidth: 150 }} onClick={handleReset}>New Product</button>
          <button className="btn-primary" style={{ flex: 1, minWidth: 150, background: "#0B1220", color: "#94A3B8" }} onClick={() => setActiveFilter("all")}>All Items</button>
          <button className="btn-primary" style={{ flex: 1, minWidth: 150, background: activeFilter === "videos" ? "linear-gradient(135deg,#1d4ed8,#2563ff)" : "#0B1220", color: activeFilter === "videos" ? "var(--button-text)" : "#94A3B8" }} onClick={() => setActiveFilter("videos")}>Video Items</button>
        </div>

        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={() => setActiveFilter('all')}>Products</button>
            <button className="btn-primary" onClick={() => setActiveFilter('orders')}>Orders</button>
            <button className="btn-primary" onClick={() => setActiveFilter('videos')}>Videos</button>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{form.id ? "Edit Product" : "Create Product"}</div>
            <form className="login-form" onSubmit={handleSave}>
              <label className="login-label">Title</label>
              <input className="login-input" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />

              <label className="login-label">Category</label>
              <select className="login-input" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                <option>Phones</option>
                <option>Laptops</option>
                <option>Accessories</option>
                <option>Audio</option>
                <option>Gaming</option>
                <option>Wearables</option>
              </select>

              <label className="login-label">Price</label>
              <input className="login-input" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />

              <label className="login-label">Subtitle</label>
              <input className="login-input" value={form.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} />

              <label className="login-label">Image URL</label>
              <input className="login-input" value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} />

              <label className="login-label">Video URL (optional)</label>
              <input className="login-input" value={form.videoUrl} onChange={(e) => handleChange("videoUrl", e.target.value)} placeholder="https://youtube.com/... or .mp4" />

              <label className="login-label">Duration</label>
              <input className="login-input" value={form.duration} onChange={(e) => handleChange("duration", e.target.value)} placeholder="03:30" />

              <label className="login-label">Views</label>
              <input className="login-input" value={form.views} onChange={(e) => handleChange("views", e.target.value)} placeholder="12K views" />

              <label className="login-label">Uploaded</label>
              <input className="login-input" value={form.uploaded} onChange={(e) => handleChange("uploaded", e.target.value)} placeholder="2 weeks ago" />

              {error && <div className="login-error">{error}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <button className="btn-primary" type="submit" style={{ flex: 1 }}>{form.id ? "Save Changes" : "Create Product"}</button>
                <button type="button" className="btn-primary" style={{ flex: 1, background: "#0B1220", color: "#94A3B8" }} onClick={handleReset}>Clear</button>
              </div>
            </form>
          </div>

          {activeFilter === 'orders' ? (
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Orders</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {orders.length === 0 && <div className="card" style={{ padding: 14, color: '#94A3B8' }}>No orders yet.</div>}
                {orders.map((o) => (
                  <div key={o.id} className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{o.id}</div>
                        <div style={{ color: '#94A3B8', fontSize: 13 }}>{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ display: 'grid', gap: 8, alignItems: 'end' }}>
                        <StatusBadge status={o.status} />
                        <StatusBadge status={o.paymentStatus} type="payment" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {o.items.map((it) => (
                        <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#cfe9ff' }}>
                          <div>{it.title} × {it.qty}</div>
                          <div>{it.price}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 150 }} onClick={() => { updateOrder(o.id, { status: 'confirmed' }); alert(`Order ${o.id} confirmed`); }}>
                        Confirm Payment
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 150, background: '#0B1220', color: '#94A3B8' }} onClick={() => { updateOrder(o.id, { status: 'shipped' }); alert(`Order ${o.id} marked shipped`); }}>
                        Mark Shipped
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 150, background: '#f97316', color: 'var(--button-text)' }} onClick={() => { updateOrder(o.id, { status: 'out_for_delivery' }); alert(`Order ${o.id} is out for delivery`); }}>
                        Out for Delivery
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 150, background: '#22c55e', color: 'var(--button-text)' }} onClick={() => { updateOrder(o.id, { paymentStatus: 'payment_confirmed' }); alert(`Payment for ${o.id} confirmed`); }}>
                        Confirm Payment
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 150, background: '#ef4444', color: 'var(--button-text)' }} onClick={() => { updateOrder(o.id, { paymentStatus: 'payment_refunded', status: 'returned' }); alert(`Order ${o.id} refunded`); }}>
                        Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Managed products</div>
              <div style={{ display: "grid", gap: 12 }}>
                {filteredProducts.length === 0 && (
                  <div className="card" style={{ padding: 14, color: "#94A3B8" }}>No products available.</div>
                )}
                {filteredProducts.map((product) => (
                  <div key={product.id} className="card" style={{ padding: 14 }}>
                    {(product.image || product.videoUrl) && (
                      <div style={{ marginBottom: 14, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#0b1220' }} />
                        ) : (product.videoUrl && getYouTubeThumbnail(product.videoUrl)) ? (
                          <div style={{ position: 'relative' }}>
                            <img src={getYouTubeThumbnail(product.videoUrl)} alt={product.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#0b1220' }} />
                            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 28, color: 'var(--button-text)', opacity: 0.95 }}>▶</div>
                          </div>
                        ) : product.videoUrl && isVideoFile(product.videoUrl) ? (
                          <video src={product.videoUrl} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', background: '#0b1220' }} controls muted />
                        ) : null}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0, display: 'grid', gap: 8 }}>
                        <div style={{ fontWeight: 700, color: "var(--text)" }}>{product.title}</div>
                        <div style={{ color: "#94A3B8", fontSize: 13 }}>{product.category}</div>
                        <div style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>{product.price || 'Price unavailable'}</div>
                        {product.videoUrl && <div style={{ marginTop: 6, color: "#2563FF", fontSize: 12, fontWeight: 700 }}>Video item</div>}
                        <div style={{ marginTop: 6, color: "#94A3B8", fontSize: 13 }}>Status: {product.status || 'approved'}</div>
                        {product.sellerName && <div style={{ marginTop: 6, color: "#94A3B8", fontSize: 13 }}>Seller: {product.sellerName}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" className="btn-primary" style={{ background: "#0B1220", color: "#94A3B8" }} onClick={() => handleEdit(product)}>Edit</button>
                        <button type="button" className="btn-primary" style={{ background: "#10b981", color: "var(--button-text)" }} onClick={() => { approveProduct(product.id); window.dispatchEvent(new Event('products-updated')); }}>Approve</button>
                        <button type="button" className="btn-primary" style={{ background: "#f97316", color: "var(--button-text)" }} onClick={() => { rejectProduct(product.id); window.dispatchEvent(new Event('products-updated')); }}>Reject</button>
                        {product.sellerId && (
                          <button type="button" className="btn-primary" style={{ background: "#8b5cf6", color: "var(--button-text)" }} onClick={() => { if (window.confirm('Ban this seller?')) { banUser(product.sellerId); alert('Seller banned'); } }}>Ban Seller</button>
                        )}
                        <button type="button" className="btn-primary" style={{ background: "#dc2626", color: "var(--button-text)" }} onClick={() => handleDelete(product.id)}>Delete</button>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, color: "#94A3B8", fontSize: 13 }}>{product.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
