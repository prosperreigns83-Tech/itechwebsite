import React, { useEffect } from "react";

export default function Splash({ onStart }) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyPadding = document.body.style.padding;
    const previousBodyHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.classList.add("splash-hidden-scroll");
    document.documentElement.classList.add("splash-hidden-scroll");

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.padding = previousBodyPadding;
      document.body.style.height = previousBodyHeight;
      document.documentElement.style.height = "";
      document.body.classList.remove("splash-hidden-scroll");
      document.documentElement.classList.remove("splash-hidden-scroll");
    };
  }, []);

  return (
    <div className="app-shell splash-shell">
      <div className="splash">
        <div className="hero-panel">
          <div className="hero-card">
            <div className="hero-decor hero-decor-top-left" />
            <div className="hero-decor hero-decor-bottom-right" />

            <div className="hero-core">
              <div className="logo-card">
                <div className="logo-inner">I</div>
              </div>
              <p className="welcome">Welcome to</p>
              <h1 className="brand">ITECH-STORE</h1>
               <p className="subtitle">INTERNATIONAL &amp; TECHNOLOGY</p>
              <p className="subtitle">Premium Gadgets &amp; Accessories</p>
              <p className="tagline">Shop Smart. <span>Live Better.</span></p>
              <button type="button" className="cta" onClick={onStart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M2 22s4-1 6-3c1.5-1.5 1.8-4.5 1.8-4.5S7 13 5.5 11.5C3 9 2 2 2 2s7 1 9.5 3.5C13 8 12 14 12 14s3 0 4.5 1.5C18 17 22 22 22 22H2z" fill="white" opacity="0.9"/>
                </svg>
                <span>Explore Store</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="trust">
                <div className="trust-item">
                  <svg className="icon" viewBox="0 0 24 24"><path d="M12 2l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="#58a6ff"/></svg>
                  <span>Secure Payments</span>
                </div>
                <div className="trust-item">
                  <svg className="icon" viewBox="0 0 24 24"><path d="M3 12h3l3 6 6-12h4" stroke="#58a6ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                  <span>Fast Delivery</span>
                </div>
                <div className="trust-item">
                  <svg className="icon" viewBox="0 0 24 24"><path d="M12 2l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="#58a6ff"/></svg>
                  <span>Genuine Products</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-footer">
            <span>Loading...</span>
            <div className="hero-dots"><span /><span /><span /></div>
            <span>Version 1.0.0</span>
            <span>© 2026 ITECH-STORE. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
