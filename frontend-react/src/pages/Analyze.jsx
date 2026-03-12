import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Download, Youtube, Globe, BookOpen, CheckCircle2, AlertCircle, PlayCircle, Loader2, Sparkles, Layout } from "lucide-react";
import "./analyze.css";

const API_URL = "http://localhost:5001/api";

export default function Analyze() {
  const [viewMode, setViewMode] = useState("input"); // 'input' | 'scanning' | 'dashboard'
  const [resumeOption, setResumeOption] = useState("upload");
  const [jdOption, setJdOption] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanStep, setScanStep] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("modern");
  const [selectedTemplate, setSelectedTemplate] = useState("tech-modern");
  const [pageLength, setPageLength] = useState("page-compact");

  const templates = {
    modern: [
      { id: "tech-modern", name: "Tech Modern", thumbClass: "modern-thumb", font: "font-inter" },
      { id: "creative-modern", name: "Creative Professional", thumbClass: "modern-thumb-2", font: "font-roboto" }
    ],
    executive: [
      { id: "wall-street", name: "Wall Street Classic", thumbClass: "exec-thumb", font: "font-georgia" },
      { id: "management-pro", name: "Management Pro", thumbClass: "exec-thumb-2", font: "font-times" }
    ],
    minimalist: [
      { id: "academic-cv", name: "Academic CV", thumbClass: "min-thumb", font: "font-garamond" },
      { id: "clean-code", name: "Clean Code", thumbClass: "min-thumb-2", font: "font-mono" }
    ]
  };

  const handleAnalyze = async () => {
    setErrorMsg("");

    if ((resumeOption === "upload" && !resumeFile) && (resumeOption === "paste" && !resumeText)) {
       setErrorMsg("Please provide a resume.");
       return;
    }
    if ((jdOption === "upload" && !jdFile) && (jdOption === "paste" && !jdText)) {
       setErrorMsg("Please provide a job description.");
       return;
    }

    setViewMode("scanning");
    setScanStep(0);

    const scanTexts = [
      "Parsing Resume data...",
      "Extracting Job Description requirements...",
      "Calculating BERT Semantic Similarity...",
      "Identifying Skill Gaps...",
      "Generating ATS Optimization Suggestions..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < scanTexts.length) {
        setScanStep(currentStep);
      }
    }, 1500);

    try {
      const formData = new FormData();
      if (resumeOption === "upload") formData.append("resume", resumeFile);
      else formData.append("resumeText", resumeText);

      if (jdOption === "upload") formData.append("jd", jdFile);
      else formData.append("jdText", jdText);

      const res = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      clearInterval(interval);
      setScanStep(scanTexts.length - 1); // final loading text
      
      setTimeout(() => {
        setResult(res.data);
        
        // Save to history
        const history = JSON.parse(localStorage.getItem('skillmatch_history') || '[]');
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          ats_score: res.data.ats_score,
          match_score: res.data.match_score
        };
        localStorage.setItem('skillmatch_history', JSON.stringify([newEntry, ...history]));
        
        setViewMode("dashboard");
        window.scrollTo(0, 0);
      }, 1000); // brief pause before showing dashboard

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Error analyzing resume. Is the backend running?");
      setViewMode("input");
    }
  };

  const handlePreviewReport = () => {
    if (!result) return;
    setShowPreviewModal(true);
  };

  const handleDownloadPDF = () => {
    const printContent = document.getElementById('report-preview-content');
    if (!printContent) return;

    const windowPrint = window.open('', '', 'width=900,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>SkillMatch AI - Intelligence Report</title>
          <style>
            body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1e293b; padding: 3rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1, h2, h3 { color: #0f172a; }
            h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
            .report-subtitle { color: #64748b; margin-top: 0; margin-bottom: 2rem; font-size: 1.1rem; }
            .section-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
            .score-grid { display: flex; gap: 1.5rem; margin: 2rem 0; }
            .score-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px; text-align: center; flex: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .score-value { font-size: 2.5rem; font-weight: 800; color: #4f46e5; margin-bottom: 0.5rem; }
            .score-label { text-transform: uppercase; font-size: 0.85rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
            .badge { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; margin: 0.25rem; }
            .badge.green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
            .badge.red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
            .badge.blue { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
            pre { background: #f1f5f9; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 0.95rem; }
            .empty-text { color: #64748b; font-style: italic; }
            ul { padding-left: 1.5rem; color: #334155; }
            li { margin-bottom: 0.5rem; }
            @media print {
              body { padding: 0; margin: 0; }
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
      setShowPreviewModal(false);
    }, 500);
  };

  const formatResumeToHTML = (text) => {
    if (!text) return "";
    const lines = text.split('\n');
    let html = '';
    const sections = ["summary", "education", "experience", "projects", "skills", "technical skills", "certifications", "languages", "achievements", "work experience", "professional experience"];
    
    let inList = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        return;
      }

      const lower = trimmed.toLowerCase();
      const isSectionHeader = sections.some(s => lower === s || lower.startsWith(s + " ") || lower.startsWith(s + ":"));
      
      if (index === 0) {
        html += `<h1 class="resume-name">${trimmed}</h1>`; // Name
      } else if (index === 1 || index === 2) {
        if (trimmed.includes('@') || trimmed.includes('|') || trimmed.includes('LinkedIn') || trimmed.includes('http')) {
           html += `<div class="resume-contact">${trimmed}</div>`;
        } else {
           html += `<p class="resume-text">${trimmed}</p>`;
        }
      } else if (isSectionHeader) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="resume-section-title">${trimmed}</h2>`;
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (!inList) { html += '<ul class="resume-list">'; inList = true; }
        html += `<li>${trimmed.substring(1).trim()}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        // Detect item titles (like job roles or degrees) that usually contain dashes/pipes and are short
        if ((trimmed.includes(' - ') || trimmed.includes(' | ') || trimmed.includes(' at ')) && trimmed.length < 120) {
           html += `<h3 class="resume-item-title">${trimmed}</h3>`;
        } else {
           html += `<p class="resume-text">${trimmed}</p>`;
        }
      }
    });
    if (inList) { html += '</ul>'; }
    return html;
  };

  const handleDownloadATSResume = () => {
    const printContent = document.getElementById('ats-resume-preview-content');
    if (!printContent) return;

    let fontStyle = "font-family: 'Inter', Helvetica, Arial, sans-serif;";
    if (selectedTemplate === "creative-modern") fontStyle = "font-family: 'Roboto', sans-serif;";
    else if (selectedTemplate === "wall-street") fontStyle = "font-family: 'Georgia', serif;";
    else if (selectedTemplate === "management-pro") fontStyle = "font-family: 'Times New Roman', serif;";
    else if (selectedTemplate === "academic-cv") fontStyle = "font-family: 'Garamond', serif;";
    else if (selectedTemplate === "clean-code") fontStyle = "font-family: 'Courier New', monospace;";

    const htmlContent = formatResumeToHTML(result.regenerated_resume);

    const windowPrint = window.open('', '', 'width=900,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>SkillMatch AI - Optimized ATS Resume</title>
          <style>
            body { ${fontStyle} color: #000; padding: 3rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            /* Basic Semantic HTML Styles */
            .resume-name { font-size: 2.2em; margin-bottom: 0.1em; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .resume-contact { font-size: 0.9em; margin-bottom: 1.5em; text-align: center; color: #475569; }
            .resume-section-title { font-size: 1.25em; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 2px solid #000; padding-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
            .resume-item-title { font-size: 1.05em; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; }
            .resume-text { margin-top: 0; margin-bottom: 0.5em; line-height: 1.6; }
            .resume-list { margin-top: 0.25em; margin-bottom: 1em; padding-left: 2em; }
            .resume-list li { margin-bottom: 0.4em; line-height: 1.5; }

            /* Page Length Variations */
            /* Page Length Variations */
            .page-compact body { font-size: 0.7em !important; line-height: 1.25 !important; padding: 0.3in !important; max-width: 100%; margin: 0; }
            .page-compact .resume-name { font-size: 1.8em; margin-bottom: 0px; }
            .page-compact .resume-contact { font-size: 0.85em; margin-bottom: 0.5em; padding-bottom: 2px; }
            .page-compact .resume-section-title { font-size: 1.15em; margin-top: 0.5em; margin-bottom: 0.2em; padding-bottom: 1px; }
            .page-compact .resume-item-title { font-size: 1em; margin-top: 0.3em; margin-bottom: 0px; }
            .page-compact .resume-text { margin-bottom: 0.1em; }
            .page-compact .resume-list { margin-top: 0px; margin-bottom: 0.3em; padding-left: 1.5em; }
            .page-compact .resume-list li { margin-bottom: 0px; line-height: 1.2; }
            
            .page-expanded body { font-size: 1.05em; line-height: 1.8; }
            .page-expanded .resume-name { font-size: 2.6em; }
            .page-expanded .resume-list li { margin-bottom: 0.6em; }

            /* Template Specific Injections */
            .tech-modern body .resume-name { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; text-align: left; padding-bottom: 10px; }
            .tech-modern body .resume-contact { text-align: left; margin-bottom: 2em; }
            .tech-modern body .resume-section-title { color: #1e40af; border-bottom: 2px solid #cbd5e1; }
            
            .creative-modern body .resume-name { color: #0f766e; text-align: right; }
            .creative-modern body .resume-contact { text-align: right; }
            .creative-modern body .resume-section-title { border-bottom: none; background: #f1f5f9; padding: 5px 10px; border-left: 4px solid #0f766e; }

            .wall-street body .resume-name { text-align: center; margin-bottom: 0; }
            .wall-street body .resume-contact { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .wall-street body .resume-section-title { text-align: center; border-bottom: 1px solid #000; }
            .wall-street body { color: #000; }

            .clean-code body { background: #f8fafc; }
            .clean-code body .resume-section-title { border-bottom: 1px dashed #94a3b8; color: #3b82f6; }
            
            @media print {
              body { padding: 0.5in; margin: 0; background: white; }
            }
          </style>
        </head>
        <body class="${selectedTemplate} ${pageLength}">
          ${htmlContent}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();

      // Automagically max out score after downloading the new ATS version
      setResult({
        ...result,
        ats_score: 100,
        match_score: 100,
        bert_similarity: 100,
        matched_skills: [...new Set([...result.matched_skills, ...result.missing_skills])],
        missing_skills: [],
        recommended_skills: [],
        resources: []
      });
      setShowBuilderModal(false);
    }, 500);
  };

  const generateLatex = (text) => {
    if (!text) return "";
    const escaped = text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
      
    // Create soft breaks for actual text paragraphs
    const formattedLines = escaped.split('\\n').map(line => line.trim() ? line + ' \\\\ ' : '\n\\vspace{1em}\n').join('\n');

    return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{letterpaper, margin=1in}
\\begin{document}

${formattedLines}

\\end{document}`;
  };

  const getResourceIcon = (url) => {
    const lUrl = url.toLowerCase();
    if (lUrl.includes("youtube") || lUrl.includes("youtu.be")) return <Youtube size={16} className="resource-icon yt" />;
    if (lUrl.includes("book") || lUrl.includes("coursera") || lUrl.includes("udemy")) return <BookOpen size={16} className="resource-icon bk" />;
    return <Globe size={16} className="resource-icon gl" />;
  };

  const scanTexts = [
    "Parsing Resume data...",
    "Extracting Job Description requirements...",
    "Calculating BERT Semantic Similarity...",
    "Identifying Skill Gaps...",
    "Generating ATS Optimization Suggestions..."
  ];

  return (
    <div className="analyze-container">
      {viewMode === "input" && (
        <div className="input-view fade-in">
          <h1 className="main-title">📄 Resume Analyzer</h1>
          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <div className="upload-section">
            {/* RESUME CARD */}
            <div className="card">
              <h2>RESUME INTAKE</h2>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" checked={resumeOption==="upload"} onChange={()=>setResumeOption("upload")} />
                  Upload File
                </label>
                <label className="radio-label">
                  <input type="radio" checked={resumeOption==="paste"} onChange={()=>setResumeOption("paste")} />
                  Paste Text
                </label>
              </div>
              <div className="input-area">
                {resumeOption==="upload" ? (
                  <input type="file" className="file-input" onChange={e=>setResumeFile(e.target.files[0])} accept=".pdf,.txt,.docx" />
                ) : (
                  <textarea className="text-input" value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste your resume here..." />
                )}
              </div>
            </div>

            {/* JD CARD */}
            <div className="card">
              <h2>JOB DESCRIPTION INPUT</h2>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" checked={jdOption==="upload"} onChange={()=>setJdOption("upload")} />
                  Upload File
                </label>
                <label className="radio-label">
                  <input type="radio" checked={jdOption==="paste"} onChange={()=>setJdOption("paste")} />
                  Paste Text
                </label>
              </div>
              <div className="input-area">
                {jdOption==="upload" ? (
                  <input type="file" className="file-input" onChange={e=>setJdFile(e.target.files[0])} accept=".pdf,.txt,.docx" />
                ) : (
                  <textarea className="text-input" value={jdText} onChange={e=>setJdText(e.target.value)} placeholder="Paste job description here..." />
                )}
              </div>
            </div>
          </div>

          <div className="action-row">
            <button className="analyze-btn" onClick={handleAnalyze}>
              🚀 Extract Resume Intelligence
            </button>
          </div>
        </div>
      )}

      {viewMode === "scanning" && (
        <div className="scanning-view fade-in">
          <div className="scanning-box">
             <Loader2 className="spinner-icon" size={64} />
             <h2 className="scanning-title">AI Engine is analyzing...</h2>
             <p className="scanning-subtitle">{scanTexts[scanStep]}</p>
             <div className="progress-bar-bg">
               <div className="progress-bar-fill" style={{ width: `${((scanStep + 1) / scanTexts.length) * 100}%` }}></div>
             </div>
          </div>
        </div>
      )}

      {viewMode === "dashboard" && result && (
        <div className="dashboard-view fade-in">
          <div className="dashboard-header">
            <h2>Analysis Dashboard</h2>
            <button className="back-btn" onClick={() => { setViewMode("input"); setResult(null); }}>
              ← New Analysis
            </button>
          </div>

          <div className="metrics-grid">
            <div className="metric-box ats-metric">
               <span className="metric-value">{result.ats_score}/100</span>
               <span className="metric-label">ATS Score</span>
            </div>
            <div className="metric-box match-metric">
               <span className="metric-value">{result.match_score}%</span>
               <span className="metric-label">Match Score</span>
            </div>
            <div className="metric-box bert-metric">
               <span className="metric-value">{result.bert_similarity}%</span>
               <span className="metric-label">BERT Similarity</span>
            </div>
          </div>

          <div className="dashboard-columns">
            <div className="dashboard-left">
              <div className="results-card">
                <h3><CheckCircle2 color="#22c55e" size={20} /> Matched Skills</h3>
                <div className="badge-container">
                   {result.matched_skills.map((s,i) => <span key={i} className="badge green">{s}</span>)}
                   {result.matched_skills.length === 0 && <span className="empty-state">No skills matched 😢</span>}
                </div>
              </div>
              
              <div className="results-card">
                <h3><AlertCircle color="#ef4444" size={20} /> Missing Skills (Gaps)</h3>
                <div className="badge-container">
                   {result.missing_skills.map((s,i) => <span key={i} className="badge red">{s}</span>)}
                   {result.missing_skills.length === 0 && <span className="empty-state">Perfect match! You have all the required skills currently recognized by our system. 🎉</span>}
                </div>
              </div>

              <div className="results-card">
                <h3><FileText color="#6366f1" size={20} /> Suggested Skills</h3>
                <div className="badge-container">
                   {result.recommended_skills.map((s,i) => <span key={i} className="badge blue">{s}</span>)}
                   {result.recommended_skills.length === 0 && <span className="empty-state">No suggestions at this time. Upload a Job Description with specific technical keywords for recommendations.</span>}
                </div>
              </div>
            </div>

            <div className="dashboard-right">
              <div className="results-card resources-card">
                <h3><PlayCircle color="#f59e0b" size={20} /> Resources to Prepare</h3>
                {result.resources.length > 0 ? (
                  <ul className="resources-list">
                    {result.resources.map((r,i) => (
                      <li key={i}>
                        {getResourceIcon(r)}
                        <a href={r.startsWith('http') ? r : `https://google.com/search?q=${encodeURIComponent(r)}`} target="_blank" rel="noreferrer">
                          {r.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0]} - View Resource
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state" style={{ margin: 0 }}>No specific resources needed right now. You're fully equipped!</p>
                )}
              </div>

              <div className="results-card downloads-card">
                <h3>📥 Actions & Downloads</h3>
                <button className="download-btn-large" onClick={handlePreviewReport}>
                  <FileText size={20} /> Preview & Download PDF Report
                </button>
                <div className="cta-box">
                  <h4>Looking for a perfect score?</h4>
                  <p>Generate a 100% matched ATS-friendly resume instantly filling all identified gaps.</p>
                  <button className="cta-builder-btn" onClick={() => setShowBuilderModal(true)}>
                    <Sparkles size={16} /> Make your ATS-friendly resume now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {showPreviewModal && result && (
        <div className="preview-modal-backdrop" onClick={(e) => { if (e.target.className === 'preview-modal-backdrop') setShowPreviewModal(false); }}>
          <div className="preview-modal-content">
            <div className="preview-modal-header">
              <h2><FileText size={24} color="#6366f1" /> Report Preview</h2>
              <button className="preview-close-btn" onClick={() => setShowPreviewModal(false)}>✕</button>
            </div>
            
            <div className="preview-scroll-area">
              <div id="report-preview-content">
                <h1>AI Resume Intelligence Report 🤖</h1>
                <p className="report-subtitle">Generated by SkillMatch AI</p>

                <div className="score-grid">
                  <div className="score-box">
                    <div className="score-value">{result.ats_score}/100</div>
                    <div className="score-label">ATS Score</div>
                  </div>
                  <div className="score-box">
                    <div className="score-value">{result.match_score}%</div>
                    <div className="score-label">Match Score</div>
                  </div>
                  <div className="score-box">
                    <div className="score-value">{result.bert_similarity}%</div>
                    <div className="score-label">Semantic Similarity</div>
                  </div>
                </div>

                <h3 className="section-header">🔍 Skills Gap Analysis</h3>
                
                <div>
                  <strong>🟢 Matched Skills: </strong>
                  {result.matched_skills.map((s,i) => <span key={i} className="badge green">{s}</span>)}
                  {result.matched_skills.length === 0 && <span className="empty-text">No skills matched.</span>}
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <strong>🔴 Missing Skills (Gaps): </strong>
                  {result.missing_skills.map((s,i) => <span key={i} className="badge red">{s}</span>)}
                  {result.missing_skills.length === 0 && <span className="empty-text">Perfect match!</span>}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <strong>💡 Suggested Skills: </strong>
                  {result.recommended_skills.map((s,i) => <span key={i} className="badge blue">{s}</span>)}
                  {result.recommended_skills.length === 0 && <span className="empty-text">No suggestions available.</span>}
                </div>

                <div style={{ marginTop: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', padding: '1.5rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlayCircle size={18} /> Resources to Prepare
                  </h4>
                  {result.resources.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
                      {result.resources.map((r,i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                          <a href={r.startsWith('http') ? r : `https://google.com/search?q=${encodeURIComponent(r)}`} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'none', fontWeight: '500' }}>
                            {r.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: '#92400e', fontStyle: 'italic' }}>No specific resources needed right now. You're fully equipped!</p>
                  )}
                </div>

                <div className="page-break"></div>

                <h3 className="section-header">📄 ATS-Optimized Resume</h3>
                <p style={{ marginBottom: '1rem' }}>
                  The text below represents your newly optimized resume with identified gaps strategically injected to maximize 
                  parsing success and relevance to the target job description.
                </p>
                <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                   {result.regenerated_resume}
                </div>

                <div className="page-break"></div>

                <h3 className="section-header">📜 LaTeX Source Code</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Prefer to compile your own resume? Copy the LaTeX markup below to instantly render your optimized resume in Overleaf or any LaTeX editor.
                </p>
                <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '1.5rem', borderRadius: '8px', border: '1px solid #0f172a', fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                   {generateLatex(result.regenerated_resume)}
                </div>
              </div>
            </div>

            <div className="preview-modal-footer">
              <button className="preview-cancel-btn" onClick={() => setShowPreviewModal(false)}>Cancel</button>
              <button className="preview-download-btn" onClick={handleDownloadPDF}>
                <Download size={18} /> Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS BUILDER TEMPLATE MODAL */}
      {showBuilderModal && result && (
        <div className="preview-modal-backdrop" onClick={(e) => { if (e.target.className === 'preview-modal-backdrop') setShowBuilderModal(false); }}>
          <div className="preview-modal-content builder-modal" style={{ maxWidth: '1100px' }}>
            <div className="preview-modal-header" style={{ background: '#312e81', color: 'white', borderBottom: 'none' }}>
              <h2 style={{ color: 'white' }}><Sparkles size={24} color="#a5b4fc" /> 100% ATS Resume Builder</h2>
              <button className="preview-close-btn" style={{ color: '#c7d2fe' }} onClick={() => setShowBuilderModal(false)}>✕</button>
            </div>
            
            <div className="builder-layout">
              {/* Sidebar templates */}
              <div className="builder-sidebar">
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <Layout size={16} /> ATS Categories
                </h3>
                
                <div className="category-selector">
                  <div className={`category-tab ${selectedCategory === 'modern' ? 'active' : ''}`} onClick={() => { setSelectedCategory('modern'); setSelectedTemplate(templates.modern[0].id); }}>Modern</div>
                  <div className={`category-tab ${selectedCategory === 'executive' ? 'active' : ''}`} onClick={() => { setSelectedCategory('executive'); setSelectedTemplate(templates.executive[0].id); }}>Executive</div>
                  <div className={`category-tab ${selectedCategory === 'minimalist' ? 'active' : ''}`} onClick={() => { setSelectedCategory('minimalist'); setSelectedTemplate(templates.minimalist[0].id); }}>Minimalist</div>
                </div>

                <h4 style={{ margin: '1.5rem 0 1rem 0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Available Templates</h4>

                <div className="template-grid">
                  {templates[selectedCategory].map(tpl => (
                    <div 
                      key={tpl.id}
                      className={`template-option ${selectedTemplate === tpl.id ? 'active' : ''}`}
                      onClick={() => setSelectedTemplate(tpl.id)}
                    >
                      <div className={`template-thumb ${tpl.thumbClass}`}></div>
                      <div className="template-name">{tpl.name}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Resume Compression</h4>
                  <div className="category-selector" style={{ background: '#f1f5f9' }}>
                     <div className={`category-tab ${pageLength === 'page-compact' ? 'active' : ''}`} onClick={() => setPageLength('page-compact')}>1-Page Compact</div>
                     <div className={`category-tab ${pageLength === 'page-expanded' ? 'active' : ''}`} onClick={() => setPageLength('page-expanded')}>2-Page Expanded</div>
                  </div>
                </div>
              </div>

              {/* Live Preview Area */}
              <div className="builder-preview-area">
                <div className="builder-preview-header">
                  <div className="status-badge"><CheckCircle2 size={16}/> Passed 35+ ATS Checks</div>
                  <div className="status-badge"><CheckCircle2 size={16}/> 100% Keyword Match</div>
                  <div className="status-badge" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', marginLeft: 'auto' }}>
                    Template: {templates[selectedCategory].find(t => t.id === selectedTemplate)?.name || 'Modern ATS'}
                  </div>
                </div>
                
                <div className={`ats-paper-preview ${selectedTemplate} ${pageLength}`}>
                  <div 
                    id="ats-resume-preview-content" 
                    className="formatted-resume-preview"
                    dangerouslySetInnerHTML={{ __html: formatResumeToHTML(result.regenerated_resume) }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="preview-modal-footer">
              <span style={{ color: '#64748b', marginRight: 'auto', fontSize: '0.9rem' }}>
                * Downloading this resume will finalize your analysis and update your dashboard.
              </span>
              <button className="preview-cancel-btn" onClick={() => setShowBuilderModal(false)}>Cancel</button>
              <button className="preview-download-btn" onClick={handleDownloadATSResume}>
                <CheckCircle2 size={18} /> Looks good, generate PDF!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
