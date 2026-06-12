import React from "react";

export default function TermsAndConditions({ onNavigate, onAccept }) {
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
            onClick={() => onNavigate("login")}
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
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>
            Terms & Conditions
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* T&C Content */}
        <div style={{ padding: "18px", overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 16 }}>
            Terms and Conditions
          </div>

          <div style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: 13 }}>
            <p style={{ marginBottom: 16 }}>
              <strong>Effective Date: January 1, 2024</strong>
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              1. Acceptance of Terms
            </h3>
            <p style={{ marginBottom: 16 }}>
              By accessing and using the iTech Store website and mobile application (collectively, the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              2. Use License
            </h3>
            <p style={{ marginBottom: 16 }}>
              Permission is granted to temporarily download one copy of the materials (information or software) on iTech Store for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose, or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              3. Disclaimer
            </h3>
            <p style={{ marginBottom: 16 }}>
              The materials on iTech Store are provided on an 'as is' basis. iTech Store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              4. Limitations
            </h3>
            <p style={{ marginBottom: 16 }}>
              In no event shall iTech Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on iTech Store, even if iTech Store or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              5. Accuracy of Materials
            </h3>
            <p style={{ marginBottom: 16 }}>
              The materials appearing on iTech Store could include technical, typographical, or photographic errors. iTech Store does not warrant that any of the materials on the Service are accurate, complete, or current. iTech Store may make changes to the materials contained on the Service at any time without notice.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              6. Links
            </h3>
            <p style={{ marginBottom: 16 }}>
              iTech Store has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by iTech Store of the site. Use of any such linked website is at the user's own risk.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              7. Modifications
            </h3>
            <p style={{ marginBottom: 16 }}>
              iTech Store may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              8. Governing Law
            </h3>
            <p style={{ marginBottom: 16 }}>
              These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              9. User Accounts
            </h3>
            <p style={{ marginBottom: 16 }}>
              If you create an account on the Service, you are responsible for maintaining the confidentiality of your account information and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
            </p>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              10. User Conduct
            </h3>
            <p style={{ marginBottom: 16 }}>
              You agree that you will not engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service. Prohibited behavior includes:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within the Service</li>
              <li>Attempting to gain unauthorized access to the Service</li>
            </ul>

            <h3 style={{ color: "#FFFFFF", marginTop: 20, marginBottom: 10, fontSize: 14 }}>
              11. Contact Information
            </h3>
            <p style={{ marginBottom: 40 }}>
              If you have any questions about these Terms and Conditions, please contact us at support@itechstore.com or call our customer service team.
            </p>
          </div>
        </div>

        {/* Accept Button */}
        <div style={{ padding: "18px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={onAccept}
            style={{
              padding: "14px",
              background: "linear-gradient(135deg,#10B981,#059669)",
              border: "none",
              borderRadius: 10,
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            I Accept Terms & Conditions
          </button>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            style={{
              padding: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Decline & Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
