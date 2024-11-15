import React, { useState } from 'react';
import './RightPanel.css';

const RightPanel = ({ isOpen, togglePanel, chats, selectChat }) => {
  return (
    <div className={`right-panel ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={togglePanel}>
        ☰
      </button>
      <button className="new-chat-button" onClick={() => selectChat(null)}>
        New Chat
      </button>
      
      <ul className="chat-list">
        {chats.map(chat => (
          <li key={chat.id} onClick={() => selectChat(chat)}>
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightPanel;