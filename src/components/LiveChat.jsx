import React, { useEffect, useRef, useState } from "react";
import { chatBot } from "../utils/api";

const initialMessages = [
  {
    role: "bot",
    text: "Hi! I am your iTech Store assistant. Ask me anything about our company, products, payments, shipping, or support."
  }
];

const fallbackReply = (question) => {
  const normalized = question.toLowerCase();

  if (/\b(payment|pay|checkout|paystack|card|transaction)\b/.test(normalized)) {
    return "You can pay securely through Paystack. We accept cards and local payments. If you have a specific payment issue, I can help explain the process or what to do next.";
  }

  if (/\b(shipping|delivery|deliver|ship|arrival|arrive)\b/.test(normalized)) {
    return "Shipping times depend on your location. Orders are usually processed quickly and we provide tracking details after purchase. For urgent delivery, contact support and we can prioritize your order.";
  }

  if (/\b(return|refund|exchange|cancel|warranty)\b/.test(normalized)) {
    return "If you need a return or refund, please let us know within the return window. We can usually arrange a return or exchange based on the product and order status.";
  }

  if (/\b(contact|support|help|question|customer support|email|phone|whatsapp)\b/.test(normalized)) {
    return "You can reach our support team at support@itechstore.com or via WhatsApp. I can also answer basic questions right here in the chat.";
  }

  if (/\b(company|about|who are|what is|itech|store)\b/.test(normalized)) {
    return "iTech Store is a customer-focused e-commerce platform offering reliable products and fast support. We help users shop online with confidence and provide clear guidance on payments, delivery, and order tracking.";
  }

  if (/\b(product|catalog|items|goods|stock|available)\b/.test(normalized)) {
    return "We offer a wide range of products across categories. Browse the home page or categories section to see what is available. If you need help finding something, ask me what you need.";
  }

  if (/\b(order|purchase|buy|checkout|how do i order|place order)\b/.test(normalized)) {
    return "To place an order, choose the product you want, add it to your cart, and go to checkout. If you need help during the process, I can guide you step by step.";
  }

  return "I am sorry, I do not have an answer for that yet. Please try a different question, or contact support@itechstore.com for more help.";
};

export default function LiveChat({ open, onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

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

  if (!open) return null;

  return (
    <div className="live-chat-panel">
      <div className="chat-panel-header">
        <span>iTech Chatbot</span>
        <button type="button" className="chat-close" onClick={onClose}>✕</button>
      </div>
      <div className="chat-body chat-body--with-input">
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
  );
}
