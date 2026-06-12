import React from "react";

export default function ChatOptions({ open, onClose, onLiveChat, onChatbot }) {
  if (!open) return null;

  return (
    <div className="chat-options-backdrop" onClick={onClose}>
      <div className="chat-options-panel" onClick={(event) => event.stopPropagation()}>
        <div className="chat-options-header">How can we help?</div>
        <button type="button" className="chat-options-button" onClick={onLiveChat}>
          LIVE CHAT
        </button>
        <button type="button" className="chat-options-button chat-options-button--primary" onClick={onChatbot}>
          ITECH AI
        </button>
        <button type="button" className="chat-options-button chat-options-button--secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
