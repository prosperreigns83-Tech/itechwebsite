import React from "react";
import BottomNav from "./BottomNav";

export default function About({ onNavigate }) {
  return (
    <div className="app-shell">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ←
          </button>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>About ITECH-STORE</div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px", overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {/* Company Overview */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Who We Are</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              ITECH-STORE is a leading international technology retailer committed to bringing the latest innovations and gadgets to customers across Nigeria and beyond. With a focus on quality, affordability, and customer satisfaction, we've been serving tech enthusiasts, professionals, and everyday users since our inception.
            </div>
          </div>

          {/* Mission */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#10B981", marginBottom: 12 }}>Our Mission</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              To make cutting-edge technology accessible to everyone by providing a curated selection of high-quality products, competitive pricing, and exceptional customer service. We believe technology should empower and enhance lives, not complicate them.
            </div>
          </div>

          {/* Vision */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6", marginBottom: 12 }}>Our Vision</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              To become the most trusted and preferred technology marketplace in Africa, known for our integrity, innovation, and dedication to customer success. We aim to be the go-to destination for anyone seeking reliable tech solutions.
            </div>
          </div>

          {/* Core Values */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Core Values</div>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{
                padding: 14,
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: 10
              }}>
                <div style={{ fontWeight: 600, color: "#10B981", marginBottom: 4 }}>Quality First</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Every product is carefully selected and tested to ensure it meets our high standards</div>
              </div>

              <div style={{
                padding: 14,
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 10
              }}>
                <div style={{ fontWeight: 600, color: "#3B82F6", marginBottom: 4 }}>Customer Focused</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Your satisfaction is our priority. We provide responsive support and hassle-free service</div>
              </div>

              <div style={{
                padding: 14,
                background: "rgba(234, 179, 8, 0.1)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                borderRadius: 10
              }}>
                <div style={{ fontWeight: 600, color: "#EAB308", marginBottom: 4 }}>Innovation</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>We continuously improve our platform and expand our product offerings</div>
              </div>

              <div style={{
                padding: 14,
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 10
              }}>
                <div style={{ fontWeight: 600, color: "#EF4444", marginBottom: 4 }}>Integrity</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>We operate with transparency and ethical business practices in all our dealings</div>
              </div>
            </div>
          </div>

          {/* What We Offer */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>What We Offer</div>
            <ul style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, marginLeft: 20 }}>
              <li>Wide selection of smartphones, laptops, and gadgets from top brands</li>
              <li>Competitive pricing and regular promotional offers</li>
              <li>Fast and reliable delivery across Nigeria</li>
              <li>Secure payment options and buyer protection</li>
              <li>Expert customer support via phone, email, and WhatsApp</li>
              <li>Warranty and after-sales service</li>
              <li>Seller platform for tech entrepreneurs</li>
              <li>Live product demonstrations and tutorials</li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Why Choose ITECH-STORE?</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#10B981" }}>Trusted Partner:</strong> We have built our reputation on delivering quality products and reliable service to thousands of satisfied customers.
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#3B82F6" }}>Expert Team:</strong> Our knowledgeable staff is passionate about technology and ready to help you find the perfect product.
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong style={{ color: "#EAB308" }}>Best Value:</strong> We offer competitive prices without compromising on quality, ensuring you get the best value for your money.
              </p>
              <p>
                <strong style={{ color: "#EF4444" }}>Community Focused:</strong> We're not just a store—we're a community of tech enthusiasts committed to innovation and excellence.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div style={{
            padding: 16,
            background: "linear-gradient(135deg,rgba(16, 185, 129, 0.15),rgba(59, 130, 246, 0.15))",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 10,
            marginBottom: 24
          }}>
            <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Have Questions?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>We'd love to hear from you. Reach out to our team anytime.</div>
            <button
              onClick={() => onNavigate("contact")}
              style={{
                width: "100%",
                padding: 12,
                background: "linear-gradient(135deg,#10B981,#059669)",
                border: "none",
                borderRadius: 8,
                color: "var(--button-text)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
