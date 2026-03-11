import React, { useState } from 'react';
import { X } from 'lucide-react';
import './FeedbackModal.css';

export default function FeedbackModal({ isOpen, onClose, mode = 'feedback' }) {
  const isContact = mode === 'contact';
  
  const options = isContact 
    ? ['Support', 'Sales', 'Other'] 
    : ['Bug', 'Feedback', 'Idea'];

  const defaultOption = options[1];

  const [feedbackType, setFeedbackType] = useState(defaultOption);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log({ type: feedbackType, title, description });
    // Reset and close
    setFeedbackType(defaultOption);  // Reset safely
    setTitle('');
    description('');
    onClose();
    alert(`${isContact ? 'Message' : 'Feedback'} submitted successfully!`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in-up">
        
        {/* Header */}
        <div className="modal-header">
          <div className="header-text">
            <h2>{isContact ? 'Contact Us' : 'Send Feedback'}</h2>
            <p>{isContact ? 'How can we help you today?' : 'Share your feedback and we will get back to you.'}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Body Form */}
        <form className="modal-body" onSubmit={handleSubmit}>
          
          {/* Segmented Control */}
          <div className="form-group">
            <label>{isContact ? 'Reason for Contact' : 'Feedback Type'}</label>
            <div className="segmented-control">
              {options.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`segment-btn ${feedbackType === type ? 'active' : ''}`}
                  onClick={() => setFeedbackType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback-title">Title</label>
            <input 
              id="feedback-title"
              type="text" 
              placeholder="Short summary" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="feedback-desc">
              {isContact ? 'Message' : 'Description'} <span style={{color: '#64748b'}}>(optional)</span>
            </label>
            <textarea 
              id="feedback-desc"
              placeholder={isContact ? "How can we help you?" : "Any additional details..."} 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>
              {isContact ? 'Send Message' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
