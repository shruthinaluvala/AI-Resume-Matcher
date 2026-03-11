import React, { useState } from "react";
import axios from "axios";
import "./analyze.css";

const API_URL = "http://localhost:5001/api";

export default function Analyze() {
  const [resumeOption, setResumeOption] = useState("upload");
  const [jdOption, setJdOption] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async () => {
    setErrorMsg("");
    setLoading(true);

    if ((resumeOption === "upload" && !resumeFile) && (resumeOption === "paste" && !resumeText)) {
       setErrorMsg("Please provide a resume.");
       setLoading(false);
       return;
    }
    
    if ((jdOption === "upload" && !jdFile) && (jdOption === "paste" && !jdText)) {
       setErrorMsg("Please provide a job description.");
       setLoading(false);
       return;
    }

    try {
      const formData = new FormData();
      if (resumeOption === "upload") formData.append("resume", resumeFile);
      else formData.append("resumeText", resumeText);

      if (jdOption === "upload") formData.append("jd", jdFile);
      else formData.append("jdText", jdText);

      const res = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
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
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Error analyzing resume. Is the backend running?");
    }
    setLoading(false);
  };

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="analyze-container">
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
        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing via AI..." : "🚀 Extract Resume Intelligence"}
        </button>
      </div>

      {result && (
        <div className="results fade-in">
          <hr />
          <h2>Analysis Dashboard</h2>
          <div className="metrics-grid">
            <div className="metric-box">
               <span className="metric-value">{result.ats_score}/100</span>
               <span className="metric-label">ATS Score</span>
            </div>
            <div className="metric-box">
               <span className="metric-value">{result.match_score}%</span>
               <span className="metric-label">Match Score</span>
            </div>
            <div className="metric-box">
               <span className="metric-value">{result.bert_similarity}%</span>
               <span className="metric-label">BERT Similarity</span>
            </div>
          </div>

          <h3>🟢 Matched Skills</h3>
          <div className="badge-container">
             {result.matched_skills.map((s,i) => <span key={i} className="badge green">{s}</span>)}
             {result.matched_skills.length === 0 && <span>No skills matched 😢</span>}
          </div>

          <h3>🔴 Missing Skills (Gaps)</h3>
          <div className="badge-container">
             {result.missing_skills.map((s,i) => <span key={i} className="badge red">{s}</span>)}
             {result.missing_skills.length === 0 && <span>Perfect match! 🎉</span>}
          </div>

          <h3>💡 Suggested Skills</h3>
          <div className="badge-container">
             {result.recommended_skills.map((s,i) => <span key={i} className="badge blue">{s}</span>)}
          </div>

          <h3>📚 Resources to Prepare</h3>
          <ul className="resources-list">
            {result.resources.map((r,i) => <li key={i}>{r}</li>)}
          </ul>

          <hr />
          <h3>📥 Downloads</h3>
          <div className="downloads-row">
            <button className="download-btn" onClick={()=>handleDownload(result.regenerated_resume, "resume_updated.txt")}>
              ⬇️ Download Updated Resume
            </button>
            <button className="download-btn" onClick={()=>handleDownload(result.regenerated_jd, "job_description_updated.txt")}>
              ⬇️ Download Updated JD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
