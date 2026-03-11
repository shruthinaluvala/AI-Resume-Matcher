import React, { useState } from 'react';
import { Mail, Clock, Send } from 'lucide-react';
import './ContactUs.css';

export default function ContactUs() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ subject, message });
    setSubject('');
    setMessage('');
    alert("Message sent successfully!");
  };

  return (
    <div className="page-container contact-page">
      
      {/* Page Header */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out.</p>
      </div>

      {/* Two Column Layout */}
      <div className="contact-grid">
        
        {/* Left Column: Get in Touch Info */}
        <div className="contact-info-panel">
          <h2>Get in Touch</h2>
          
          <div className="info-item">
            <div className="info-icon">
              <Mail size={20} />
            </div>
            <div>
              <p className="info-label">EMAIL</p>
              <p className="info-value">support@skillmatch.ai</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Clock size={20} />
            </div>
            <div>
              <p className="info-label">WORKING HOURS</p>
              <p className="info-value">Mon - Fri, 9AM - 6PM IST</p>
            </div>
          </div>

          <div className="info-note">
            <p><em>Note: We will get back to you within 1-2 business days.</em></p>
          </div>
          
          {/* Decorative Elements */}
          <div className="contact-decoration">
            <div className="at-symbol">@</div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-form-panel">
          <h2>Send Us a Message</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                placeholder="Enter the subject" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                placeholder="Enter your message" 
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-message-btn" disabled={!subject.trim() || !message.trim()}>
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
