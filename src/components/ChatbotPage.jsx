import React, { useEffect, useRef, useState } from "react";
import { chatBot } from "../utils/api";

const initialMessages = [
  {
    role: "bot",
    text: "Hi! I am your iTech Store assistant. Ask me anything about our company, products, payments, shipping, or support."
  }
];

const fallbackReply = (question) => {
  const normalized = question.toLowerCase().trim();

  if (!normalized) {
    return "Please type your question and I'll do my best to help.";
  }

  const fallbackRules = [
    {
      pattern: /\b(?:hi|hello|hey|good morning|good afternoon|good evening)\b/,
      response: "Hello! I am your iTech Store assistant. Ask me anything about products, orders, payments, shipping, or support."
    },
    {
      pattern: /\b(?:how are you|wassup|sup|how is it going)\b/,
      response: "I'm doing great, thanks! How can I help you with iTech Store today?"
    },
    {
      pattern: /\b(?:thank you|thanks|thx|appreciate it)\b/,
      response: "You're welcome! If you have any other questions, feel free to ask."
    },
    {
      pattern: /\b(?:payment|pay|checkout|paystack|card|transaction|visa|mastercard|paypal|bank transfer|transfer)\b/,
      response: "We support secure payments through Paystack, cards, bank transfers, and other available methods. If you have a specific payment question, I can help guide you."
    },
    {
      pattern: /\b(?:shipping|delivery|ship|dispatch|tracking|track|courier|arrive|arrival|deliver)\b/,
      response: "Shipping times depend on your location. Orders are usually processed within 24–48 hours and tracking details are provided once your order ships. For urgent deliveries, contact support and we'll prioritize your order."
    },
    {
      pattern: /\b(?:order status|where is my order|my order|check order|order tracking|track order|order number)\b/,
      response: "You can track your order using the tracking information sent to your email after shipment. If you need help, provide your order details and I can direct you to the right place."
    },
    {
      pattern: /\b(?:return|refund|exchange|cancel|warranty|guarantee|defective|damaged|money back)\b/,
      response: "If you need a return, refund, or exchange, contact support with your order number. Damaged or defective items typically qualify for replacement or refund, depending on the product and policy."
    },
    {
      pattern: /\b(?:warranty|guarantee|coverage)\b/,
      response: "Many of our products come with manufacturer warranties. Warranty duration varies by product, so check the product page or contact support for exact details."
    },
    {
      pattern: /\b(?:stock|available|availability|in stock|out of stock|inventory)\b/,
      response: "Product availability changes regularly. Check the product page for the latest inventory status or contact support if you want to know when an item is back in stock."
    },
    {
      pattern: /\b(?:discount|sale|promo|promotion|coupon|voucher|offer|deal|special price)\b/,
      response: "We run regular promotions and discounts. Check our homepage or sales section for the latest deals. If you'd like, I can tell you how to redeem an offer."
    },
    {
      pattern: /\b(?:account|login|sign in|password|register|signup|create account|profile)\b/,
      response: "You can manage your account, orders, and profile information from your dashboard. If you have trouble logging in, try resetting your password or contact support for help."
    },
    {
      pattern: /\b(?:support|help|customer service|contact|email|phone|whatsapp|live chat)\b/,
      response: "Our support team is available to help with orders, products, and account issues. You can contact us through the support page or email support@itechstore.com."
    },
    {
      pattern: /\b(?:product|products|electronics|gadgets|devices|catalog|items|goods|available items|what do you sell)\b/,
      response: "We offer a wide range of products including phones, laptops, accessories, audio gear, smart home devices, and more. Ask me about a specific product or category and I'll help you find it."
    },
    {
      pattern: /\b(?:price|cost|how much|amount|fee|pricing|cheapest|expensive)\b/,
      response: "Prices are listed on each product page. If you're looking for something specific, tell me the product name and I can help you find its price."
    },
    {
      pattern: /\b(?:company|about|who are you|about itech|about store|who owns itech|who founded itech|founder|owner)\b/,
      response: "iTech Store is an online technology shop focused on premium gadgets, accessories, and customer support. We aim to make shopping easy, secure, and enjoyable."
    },
    {
      pattern: /\b(?:bulk order|wholesale|large order|corporate order|business order)\b/,
      response: "We support bulk and wholesale purchases. Contact our sales team for custom pricing and order arrangements for larger orders."
    },
    {
      pattern: /\b(?:security|safe|secure|privacy|protect|data)\b/,
      response: "We take security seriously and protect customer information with secure systems. Payment data is handled safely through trusted payment gateways."
    },
    {
      pattern: /\b(?:website|navigate|home page|browse|categories|find|search)\b/,
      response: "Browse our home page or categories section to find products. If you tell me what you need, I can help you locate the right item or page."
    },
    {
      pattern: /\b(?:shipping cost|delivery fee|shipping fee)\b/,
      response: "Shipping fees may vary by location and order size. The exact delivery cost is shown during checkout before you place your order."
    },
    {
      pattern: /\b(?:return policy|refund policy|exchange policy|cancellation policy)\b/,
      response: "Our return and refund policy depends on the product. Generally, returns are accepted within the return window if the item is in good condition. Contact support for details on your specific purchase."
    }
  ];

  for (const rule of fallbackRules) {
    if (rule.pattern.test(normalized)) {
      return rule.response;
    }
  }

  return "I'm sorry, I don't have an answer for that yet. Please try asking another question about products, orders, payments, shipping, or support. For faster help, contact support@itechstore.com.";
};
export default function ChatbotPage({ onNavigate }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setDraft("");
    setIsThinking(true);

    try {
      const response = await chatBot(question);
      const answer = response?.data?.answer || response?.answer || fallbackReply(question);
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setMessages((prev) => [...prev, { role: "bot", text: fallbackReply(question) }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>ITech AI</div>
          <button type="button" className="btn-primary" style={{ padding: '8px 14px' }} onClick={() => onNavigate('home')}>
            Close
          </button>
        </div>

        <div className="chat-page-shell">
          <div className="chat-messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <div key={index} className={`chat-message chat-message--${message.role}`}>
                <span>{message.text}</span>
              </div>
            ))}
            {isThinking && (
              <div className="chat-message chat-message--bot chat-message--thinking">
                <span>Typing...</span>
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question about iTech Store..."
            />
            <button type="submit" className="chat-send-btn">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
