import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, FileText, MessageSquare, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ isAuthenticated, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'History', path: '/my-resumes' },
    { label: 'Resume Tips', path: '/tips' }
  ];

  return (
    <nav className="lampzi-navbar">
      <div className="nav-container">
        
        <div className="logo-container">
          <Link to="/home" className="logo-link">
             {/* Simple visual mock of Lampzi sunburst logo */}
             <div className="logo-icon">🌟</div>
             <span className="logo-text">SkillMatch AI</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Auth / Avatar */}
        <div className="nav-right">
          {!isAuthenticated ? (
            <div className="auth-buttons-nav">
              <Link to="/login" className="nav-login-btn">Log in</Link>
              <Link to="/signup" className="nav-signup-btn">Sign up</Link>
            </div>
          ) : (
            <div className="avatar-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="avatar-circle">S</div>
              
              {dropdownOpen && (
                <div className="avatar-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">S</div>
                    <div className="dropdown-user-info">
                      <p className="user-name">Sruthi Naluvala</p>
                      <p className="user-email">sruthinaluvala55@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-body">
                    <div className="dropdown-item">
                      <Settings size={16} /> Manage account
                    </div>
                    <Link to="/my-resumes" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FileText size={16} /> My Resumes
                    </Link>
                    <Link to="/contact" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <MessageSquare size={16} /> Contact Us
                    </Link>
                    <div className="dropdown-item text-red" onClick={onLogout} style={{cursor: 'pointer'}}>
                       <LogOut size={16} /> Sign out
                    </div>
                  </div>
                  
                  <div className="dropdown-footer">
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>SkillMatch Auth</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}
