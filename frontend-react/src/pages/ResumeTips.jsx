import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import './ResumeTips.css';

export default function ResumeTips() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const rules = [
    {
      id: 1,
      title: "Tailor to the Job Description",
      description: "AI Matchers and ATS look for high keyword overlap. Always align your resume content directly with the responsibilities and requirements listed in the job description."
    },
    {
      id: 2,
      title: "Use ATS-Friendly Formatting",
      description: "Stick to simple, single-column layouts and standard fonts (like Arial or Calibri). Complex designs, text boxes, and multi-column formats often confuse parsing algorithms."
    },
    {
      id: 3,
      title: "Stick to Standard Section Headings",
      description: "AI parsers expect standard headings like \"Experience,\" \"Education,\" and \"Skills.\" Creative headings like \"My Journey\" can cause entire sections to be missed."
    },
    {
      id: 4,
      title: "Quantify Your Achievements",
      description: "Show, don't just tell. Use metrics, percentages, and dollar amounts (e.g., \"Increased revenue by 20%\") to provide concrete evidence of your impact."
    },
    {
      id: 5,
      title: "Omit Images, Graphics, and Complex Tables",
      description: "ATS systems strip away graphics and often scramble data inside tables. Keep your resume entirely text-based to ensure perfect parsing."
    },
    {
      id: 6,
      title: "Include a Dedicated Skills Section",
      description: "Format your hard skills in a clear, bulleted or comma-separated list. ATS scanners often verify standard technical terms directly from your skills block."
    },
    {
      id: 7,
      title: "Avoid Headers and Footers",
      description: "Information placed in the header or footer of a document is often completely ignored by Applicant Tracking Systems. Put your contact info in the main body text."
    },
    {
      id: 8,
      title: "Prioritize Top Required Skills",
      description: "AI analyzers often weight skills mentioned frequently or early in the job description higher. Make sure you prominently display these top skills near the beginning of your resume."
    },
    {
      id: 9,
      title: "Use Exact Keyword Phrasing",
      description: "If the job description asks for \"Search Engine Optimization,\" use that exact phrase rather than just \"SEO.\" Some ATS configurations are very rigid about exact matches."
    },
    {
      id: 10,
      title: "Proofread for Spelling and Grammar",
      description: "You cannot match a keyword if it is misspelled. ATS algorithms won't understand typos, so a single spelling error could cost you crucial match points."
    }
  ];

  return (
    <div className="page-container tips-page">
      
      <div className="tips-hero">
        <h1>The 10 Golden Rules</h1>
        <h3>Read once, win always</h3>
        <p>Craft a winning resume with these expert tips and best practices.</p>
      </div>

      <div className="rules-list">
        {rules.map(rule => (
          <div key={rule.id} className="rule-card">
            <div className="rule-number-circle">{rule.id}</div>
            <div className="rule-content">
              <h4>{rule.title}</h4>
              <p>{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="feedback-fab" onClick={() => setIsFeedbackOpen(true)}>
        <MessageSquare size={18} />
        Feedback
      </button>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        mode="feedback"
      />

    </div>
  );
}
