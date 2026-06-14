import React, { useState } from "react";
import BottomNav from "./BottomNav";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaTelegram } from "react-icons/fa6";
import showroomImage from "../images/storeshowroom.png";
import supportPersonImage from "../images/supportperson.jpeg";
import "./Contact.css";

const Contact = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const faqItems = [
    {
      id: 1,
      question: "How can I place an order?",
      answer:
        "You can easily place an order by browsing our products, selecting your items, adding them to your cart, and proceeding to checkout. We accept various payment methods including card, bank transfer, and mobile payment.",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards (Visa, Mastercard), bank transfers, mobile payments (MTN Mobile Money, Airtel Money), and PayStack. All transactions are secured with encryption.",
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 2-5 business days within Lagos. For other Nigerian cities, delivery typically takes 5-10 business days. Express delivery options are also available for urgent orders.",
    },
    {
      id: 4,
      question: "Can I track my order?",
      answer:
        "Yes! Once your order is confirmed, you'll receive a tracking number via email and SMS. You can track your order in real-time through your account dashboard on our website.",
    },
    {
      id: 5,
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unopened and undamaged products. Items must be in original packaging with all accessories. Approved returns will be processed within 5-7 business days.",
    },
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Invalid phone number";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          subject: formData.subject,
          message: `Name: ${formData.fullName}\nPhone: ${formData.phone}\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setFormErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      alert(
        "Error sending message. Please try again or use the direct contact methods below."
      );
    }
  };

  return (
    <div className="contact-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <button onClick={() => onNavigate("home")} className="breadcrumb-link">
          Home
        </button>
        <span className="breadcrumb-separator">•</span>
        <span className="breadcrumb-current">Contact Us</span>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">
            We're here to help! Reach out to us anytime for support, inquiries, or feedback.
          </p>
        </div>
        <div className="hero-graphic">
          <img src={showroomImage} alt="ITECH Store Showroom" className="headset-icon" />
          <div className="glow-ring"></div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-cards-section">
        <div className="contact-card">
          <div className="card-icon">📞</div>
          <div className="card-content">
            <h3>Phone & WhatsApp</h3>
            <p className="card-main">+234 916 224 9670</p>
            <p className="card-secondary">Mon - Sat, 9:00 AM - 8:00 PM</p>
          </div>
        </div>

        <div className="contact-card">
          <div className="card-icon">✉️</div>
          <div className="card-content">
            <h3>Email Address</h3>
            <p className="card-main">support@itechstore.com</p>
            <p className="card-secondary">We reply within 24 hours</p>
          </div>
        </div>

        <div className="contact-card">
          <div className="card-icon">📍</div>
          <div className="card-content">
            <h3>Our Location</h3>
            <p className="card-main">25 Admiralty Way, Lekki</p>
            <p className="card-secondary">Lagos State, Nigeria</p>
          </div>
        </div>

        <div className="contact-card">
          <div className="card-icon">🕐</div>
          <div className="card-content">
            <h3>Business Hours</h3>
            <p className="card-main">Mon - Sat, 9:00 AM - 8:00 PM</p>
            <p className="card-secondary">Sunday, 12:00 PM - 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="form-map-section">
        <div className="form-container">
          <h2 className="section-title">Send Us a Message</h2>
          <p className="section-subtitle">
            Fill in the form and our team will get back to you.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className={formErrors.fullName ? "error" : ""}
                />
              </div>
              {formErrors.fullName && (
                <span className="error-message">{formErrors.fullName}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={formErrors.email ? "error" : ""}
                  />
                </div>
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 XXX XXX XXXX"
                    className={formErrors.phone ? "error" : ""}
                  />
                </div>
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <div className="input-wrapper">
                <span className="input-icon">📌</span>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help?"
                  className={formErrors.subject ? "error" : ""}
                />
              </div>
              {formErrors.subject && (
                <span className="error-message">{formErrors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <div className="input-wrapper textarea-wrapper">
                <span className="input-icon textarea-icon">💬</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                  className={formErrors.message ? "error" : ""}
                />
              </div>
              {formErrors.message && (
                <span className="error-message">{formErrors.message}</span>
              )}
            </div>

            <button type="submit" className="submit-button">
              <span className="button-icon">✓</span>
              Send Message
            </button>

            {submitted && (
              <div className="success-message">
                ✓ Thank you! Your message has been received. We'll get back to
                you soon.
              </div>
            )}
          </form>
        </div>

        <div className="map-container">
          <h2 className="section-title">Visit Our Store</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <p>📍 Lekki, Lagos</p>
              <p>25 Admiralty Way, Lekki Phase 1</p>
            </div>
          </div>
          <p className="store-description">
            You can visit our physical store for the best shopping experience and exclusive deals.
          </p>
          <button className="directions-button">
            Get Directions →
          </button>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="social-section">
        <h2 className="section-title">Connect With Us</h2>
        <p className="section-subtitle">Follow us for the latest updates and offers</p>
        <div className="social-icons">
          <a href="https://facebook.com/itechstore" target="_blank" rel="noreferrer" className="social-icon facebook" title="Facebook">
            <FaFacebook />
          </a>
          <a href="https://instagram.com/itechstore" target="_blank" rel="noreferrer" className="social-icon instagram" title="Instagram">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com/@accessories876" target="_blank" rel="noreferrer" className="social-icon tiktok" title="TikTok">
            <FaTiktok />
          </a>
          <a href="https://youtube.com/@itechstore-i2w" target="_blank" rel="noreferrer" className="social-icon youtube" title="YouTube">
            <FaYoutube />
          </a>
          <a href="https://x.com/ITECHSTORE0576y" target="_blank" rel="noreferrer" className="social-icon twitter" title="X / Twitter">
            <FaXTwitter />
          </a>
          <a href="https://t.me/itech_store667" target="_blank" rel="noreferrer" className="social-icon telegram" title="Telegram">
            <FaTelegram />
          </a>
          <a href="https://t.me/itechstore_33" target="_blank" rel="noreferrer" className="social-icon telegram-profile" title="Telegram">
            <FaTelegram />
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`faq-item ${expandedFaq === item.id ? "expanded" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setExpandedFaq(expandedFaq === item.id ? null : item.id)
                }
              >
                <span>{item.question}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Banner */}
      <div className="support-banner">
        <div className="support-content">
          <img src={supportPersonImage} alt="Support Team" className="support-image" />
          <div className="support-text">
            <h2>We're Always Here to Help</h2>
            <p>
              Your satisfaction is our priority. Our support team is always ready to assist you with any questions or concerns.
            </p>
            <ul className="support-features">
              <li>✓ Fast Response</li>
              <li>✓ Friendly Support</li>
              <li>✓ Reliable Service</li>
              <li>✓ 24/7 Assistance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#blog">Our Blog</a>
            <a href="#press">Press & Media</a>
          </div>

          <div className="footer-column">
            <h4>Customer Service</h4>
            <a href="#contact">Contact Us</a>
            <a href="#faq">FAQs</a>
            <a href="#returns">Returns Policy</a>
            <a href="#shipping">Shipping Info</a>
            <a href="#track">Track Order</a>
          </div>

          <div className="footer-column">
            <h4>Helpful Links</h4>
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#payment">Payment Methods</a>
            <a href="#warranty">Warranty Policy</a>
          </div>

          <div className="footer-column newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe to get updates on new arrivals and special offers.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>→</button>
            </div>
          </div>
        </div>

        <div className="footer-badges">
          <div className="badge">
            <span className="badge-icon">✓</span>
            <span>100% Original Products</span>
          </div>
          <div className="badge">
            <span className="badge-icon">🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className="badge">
            <span className="badge-icon">↺</span>
            <span>Easy Returns</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 ITECH-STORE. All rights reserved.</p>
        </div>
      </footer>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
};

export default Contact;
