import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid, FileText, Eye, Edit2, Download, MoreVertical, Trash2 } from 'lucide-react';
import './MyResumes.css';

export default function MyResumes() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('skillmatch_history') || '[]');
    setHistory(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('skillmatch_history', JSON.stringify(updated));
  };

  return (
    <div className="page-container my-resumes">
      
      <div className="resumes-header">
        <h1>Analysis History</h1>
        
        <div className="actions-right">
          <div className="view-toggles">
            <button className="toggle-btn active"><List size={18} /></button>
            <button className="toggle-btn"><Grid size={18} /></button>
          </div>
          
          <button 
            className="create-btn"
            onClick={() => navigate('/analyze')}
          >
            Make Analysis
          </button>
        </div>
      </div>

      <div className="resume-list-container mt-6">
        
        {history.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
            <p>No analysis history found. Start by making a new analysis!</p>
          </div>
        ) : (
          history.map(item => {
            const dateObj = new Date(item.date);
            return (
              <div key={item.id} className="resume-row">
                <div className="resume-info-left">
                  <FileText className="doc-icon" />
                  <div>
                    <div className="resume-title-row">
                      <span className="resume-title">Analysis_{dateObj.toISOString().split('T')[0]}_{dateObj.getTime().toString().slice(-4)}</span>
                      <span className="badge-paid" style={{background: 'var(--lampzi-green)', color: '#0f172a'}}>
                        Match: {item.match_score}%
                      </span>
                      <span className="badge-paid" style={{background: '#38bdf8', color: '#0f172a'}}>
                        ATS: {item.ats_score}/100
                      </span>
                    </div>
                    <div className="resume-meta">
                      <span>Analyzed on: {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="resume-actions">
                  <button className="action-btn text-green" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16}/> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}

      </div>

    </div>
  );
}
