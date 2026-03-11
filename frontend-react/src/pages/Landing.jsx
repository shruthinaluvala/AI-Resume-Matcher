import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Brain, Lightbulb } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <div className={`landing-overlay ${showContent ? 'fade-in' : ''}`}>
        
        <div className="landing-hero">
          <h1 className="landing-title">
            Resume Match & <span className="highlight-text">Skill Suggester</span>
          </h1>
          <p className="landing-subtitle">AI-Powered Resume Optimization Tool</p>
        </div>

        <div className="landing-features">
          <div className="feature-item" style={{ animationDelay: '0.4s' }}>
            <div className="feature-icon-wrapper">
              <FileText size={32} strokeWidth={2.5} color="#fff" />
            </div>
            <span className="feature-text">Resume Analysis</span>
          </div>

          <div className="feature-item" style={{ animationDelay: '0.6s' }}>
            <div className="feature-icon-wrapper">
              <Brain size={32} strokeWidth={2.5} color="#fff" />
            </div>
            <span className="feature-text">AI Matching</span>
          </div>

          <div className="feature-item" style={{ animationDelay: '0.8s' }}>
            <div className="feature-icon-wrapper">
              <Lightbulb size={32} strokeWidth={2.5} color="#fff" />
            </div>
            <span className="feature-text">Skill Suggestions</span>
          </div>
        </div>

        <button 
          className="enter-app-btn" 
          onClick={handleEnter}
          style={{ animationDelay: '1.2s' }}
        >
          Enter Workspace
        </button>

      </div>
    </div>
  );
}
