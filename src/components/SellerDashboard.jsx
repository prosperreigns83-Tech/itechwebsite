import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../utils/productStore";
import { getOrdersBySeller, getSalesSummary, updateOrder } from "../utils/orderStore";
import UploadProduct from "./UploadProduct";
import ToggleMenu from "./ToggleMenu";
import StatusBadge from "./StatusBadge";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "add", label: "Add Product" },
  { id: "products", label: "My Products" },
  { id: "orders", label: "Orders" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

export default function SellerDashboard({ onNavigate, storedAccount, selectedTab }) {
  const [tab, setTab] = useState(selectedTab || "overview");
  const [myProducts, setMyProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      const all = getProducts();
      const mine = all.filter((p) => p.sellerId && storedAccount && p.sellerId === storedAccount.id);
      setMyProducts(mine);
    };
    load();
    window.addEventListener("products-updated", load);
    return () => window.removeEventListener("products-updated", load);
  }, [storedAccount]);

  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState({ total: 0, count: 0, orders: [] });

  useEffect(() => {
    const loadOrders = () => {
      if (!storedAccount) return;
      const o = getOrdersBySeller(storedAccount.id);
      setOrders(o);
      setSales(getSalesSummary(storedAccount.id));
    };
    loadOrders();
    window.addEventListener("orders-updated", loadOrders);
    return () => window.removeEventListener("orders-updated", loadOrders);
  }, [storedAccount]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    deleteProduct(id);
  };

  useEffect(() => {
    if (selectedTab) {
      setTab(selectedTab);
    }
  }, [selectedTab]);

  return (
    <div className="app-shell">
      <div className="home">
        <div className="topbar">
          <button type="button" className="menu-toggle" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>Seller Hub</div>
            <div style={{ color: "#94A3B8", marginTop: 6, fontSize: 13 }}>
              Manage listings, orders, and store performance from one polished dashboard.
            </div>
          </div>
          <button type="button" className="chat-toggle" onClick={() => onNavigate("home")}>🏠</button>
        </div>

        <div className="summary-grid">
          <div className="card small" style={{ minHeight: 120 }}>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>Live Products</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>{myProducts.length}</div>
            <div style={{ color: "#60A5FA", marginTop: 8 }}>Your store catalogue</div>
          </div>
          <div className="card small" style={{ minHeight: 120 }}>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>Total Orders</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>{orders.length}</div>
            <div style={{ color: "#60A5FA", marginTop: 8 }}>Sales captured this period</div>
          </div>
          <div className="card small" style={{ minHeight: 120 }}>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>Revenue</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>${sales.total.toFixed(2)}</div>
            <div style={{ color: "#60A5FA", marginTop: 8 }}>Payout ready amount</div>
          </div>
          <div className="card small" style={{ minHeight: 120 }}>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 8 }}>Items Sold</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>{sales.count}</div>
            <div style={{ color: "#60A5FA", marginTop: 8 }}>Demand score</div>
          </div>
        </div>

        <div className="category-row">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`category ${tab === item.id ? "category-active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 10, fontWeight: 700, color: "#cfe9ff" }}>
          {tab === "overview" && "Quick Store Insights"}
          {tab === "add" && "Add a New Product"}
          {tab === "products" && "Your Current Listings"}
          {tab === "orders" && "Recent Seller Orders"}
          {tab === "analytics" && "Performance Overview"}
          {tab === "settings" && "Store Settings"}
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 16 }}>
          {tab === "overview" && (
            <>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>Welcome back, {storedAccount?.name || "Seller"}</div>
                    <div style={{ color: "#94A3B8", marginTop: 4 }}>Everything is set up and ready for your next wave of sales.</div>
                  </div>
                  <button className="btn-primary" type="button" onClick={() => setTab("add")}>Add Product</button>
                </div>
                <div className="summary-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                  <div className="card small" style={{ minHeight: 100, padding: 16 }}>
                    <div style={{ color: "#94A3B8", marginBottom: 8 }}>Recent sales</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>${sales.total.toFixed(2)}</div>
                  </div>
                  <div className="card small" style={{ minHeight: 100, padding: 16 }}>
                    <div style={{ color: "#94A3B8", marginBottom: 8 }}>Order growth</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>+{orders.length}%</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "add" && (
            <UploadProduct onNavigate={(p) => { if (p === "seller-dashboard") setTab("products"); else onNavigate(p); }} storedAccount={storedAccount} />
          )}

          {tab === "products" && (
            <div className="card" style={{ display: "grid", gap: 12 }}>
              {myProducts.length === 0 ? (
                <div style={{ color: "#94A3B8" }}>No products yet. Add your first item to start selling.</div>
              ) : (
                myProducts.map((p) => (
                  <div key={p.id} className="card small" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{p.title}</div>
                      <div style={{ color: "#94A3B8", marginTop: 6 }}>{p.category} • {p.price}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button className="btn-primary" type="button" onClick={() => onNavigate("upload")}>Edit</button>
                      <button className="btn-primary" style={{ background: "#dc2626" }} type="button" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="card" style={{ display: "grid", gap: 14 }}>
              {orders.length === 0 ? (
                <div style={{ color: "#94A3B8" }}>No orders yet. Your store will show incoming sales here.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="card small" style={{ padding: 16, display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>Order #{o.id}</div>
                        <div style={{ color: "#94A3B8", marginTop: 6 }}>{new Date(o.createdAt).toLocaleString()}</div>
                        <div style={{ marginTop: 6, color: "#94A3B8" }}>Payment: {o.paymentMethod}</div>
                      </div>
                      <div style={{ display: "grid", gap: 8, alignItems: "end" }}>
                        <StatusBadge status={o.status} />
                        <StatusBadge status={o.paymentStatus} type="payment" />
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {o.items.filter((it) => it.sellerId === storedAccount.id).map((it) => (
                        <div key={it.id} style={{ display: "flex", justifyContent: "space-between", color: "#cfe9ff" }}>
                          <span>{it.title} × {it.qty}</span>
                          <span>{it.price}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 140 }} onClick={() => { updateOrder(o.id, { status: 'shipped' }); alert(`Order ${o.id} marked shipped`); }}>
                        Mark Shipped
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 140, background: '#f97316', color: '#FFFFFF' }} onClick={() => { updateOrder(o.id, { status: 'out_for_delivery' }); alert(`Order ${o.id} is out for delivery`); }}>
                        Out for Delivery
                      </button>
                      <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 140, background: '#22c55e', color: '#FFFFFF' }} onClick={() => { updateOrder(o.id, { status: 'delivered', paymentStatus: 'payment_confirmed' }); alert(`Order ${o.id} delivered`); }}>
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "analytics" && (
            <div className="card" style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                <div className="card small" style={{ padding: 16 }}>
                  <div style={{ color: "#94A3B8", marginBottom: 8 }}>Total Revenue</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>${sales.total.toFixed(2)}</div>
                </div>
                <div className="card small" style={{ padding: 16 }}>
                  <div style={{ color: "#94A3B8", marginBottom: 8 }}>Orders Completed</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF" }}>{orders.length}</div>
                </div>
              </div>
              <div className="card small" style={{ padding: 18 }}>
                <div style={{ fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>Traffic Insights</div>
                <div style={{ color: "#94A3B8" }}>More buyers are discovering your products. Keep your listings updated for best results.</div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="card" style={{ display: "grid", gap: 14 }}>
              <div style={{ fontWeight: 700, color: "#FFFFFF" }}>Seller Store Settings</div>
              <div style={{ color: "#94A3B8" }}>This section will let you manage payout preferences, shipping options, and store information.</div>
              <button type="button" className="btn-primary" onClick={() => onNavigate("profile-settings")}>Go to Profile Settings</button>
            </div>
          )}
        </div>

        <ToggleMenu
          open={menuOpen}
          title="Seller Menu"
          onClose={() => setMenuOpen(false)}
          items={[
            { label: "Overview", onClick: () => { setTab("overview"); setMenuOpen(false); } },
            { label: "Add Product", onClick: () => { setTab("add"); setMenuOpen(false); } },
            { label: "My Products", onClick: () => { setTab("products"); setMenuOpen(false); } },
            { label: "Orders", onClick: () => { setTab("orders"); setMenuOpen(false); } },
            { label: "Sales Analytics", onClick: () => { setTab("analytics"); setMenuOpen(false); } },
            { label: "Store Settings", onClick: () => { setTab("settings"); setMenuOpen(false); } },
            { label: "Go to Shop", onClick: () => { onNavigate("home"); setMenuOpen(false); }, style: { background: "#0B1220", color: "#94A3B8" } },
            { label: "Seller Orders Page", onClick: () => { onNavigate("seller-orders"); setMenuOpen(false); } },
            { label: "Earnings Page", onClick: () => { onNavigate("seller-earnings"); setMenuOpen(false); } },
            { label: "Analytics Page", onClick: () => { onNavigate("seller-analytics"); setMenuOpen(false); } },
            { label: "Store Settings Page", onClick: () => { onNavigate("seller-settings"); setMenuOpen(false); } },
          ]}
        />
      </div>
    </div>
  );
}
