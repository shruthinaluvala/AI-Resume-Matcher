import React from 'react';
import './GoogleAccountChooser.css';

export default function GoogleAccountChooser({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  // Realistic mock accounts
  const accounts = [
    {
      name: "Sruthi Naluvala",
      email: "sruthi.naluvala@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=Sruthi+Naluvala&background=random&color=fff",
    },
    {
      name: "Sruthi Work",
      email: "sruthinaluvala_work@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=Sruthi+Work&background=0284c7&color=fff",
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target.className === 'google-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="google-modal-backdrop" onClick={handleBackdropClick}>
      <div className="google-modal-content">
        
        {/* Google Header */}
        <div className="google-modal-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
            alt="Google" 
            className="google-modal-logo"
            width="75"
          />
          <h1 className="google-modal-title">Sign in</h1>
          <p className="google-modal-subtitle">Choose an account</p>
          <div className="google-modal-appinfo">
            <span>to continue to <b>SkillMatch AI</b></span>
          </div>
        </div>

        {/* Account List */}
        <div className="google-account-list">
          {accounts.map((acc, idx) => (
            <div 
              key={idx} 
              className="google-account-item"
              onClick={() => onSelect(acc)}
            >
              <img src={acc.avatar} alt={acc.name} className="account-avatar" />
              <div className="account-details">
                <div className="account-name">{acc.name}</div>
                <div className="account-email">{acc.email}</div>
              </div>
            </div>
          ))}
          
          <div className="google-account-item action-item">
            <div className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
            </div>
            <div className="account-details">
              <div className="account-name action-text">Use another account</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="google-modal-footer">
          <p>
            To continue, Google will share your name, email address, and language preference with SkillMatch AI. Before using this app, you can review SkillMatch AI's <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
