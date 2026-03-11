import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "What makes SkillMatch AI stand out from other builders?", a: "We don't just build your resume, we use advanced BERT similarity engines to match your skills exactly to your target job description." },
    { q: "How do I get started with the AI Analyzer?", a: "Simply sign up, paste your current resume, paste the target job description, and let our engine instantly identify your skill gaps." },
    { q: "Are the regenerated resumes ATS-friendly?", a: "Absolutely. We enforce formatting rules that parse perfectly in all major Applicant Tracking Systems." },
    { q: "Can I download my updated resume?", a: "Yes, once analyzed, you can download a regenerated text file containing all your heavily optimized AI additions." }
  ];

  const testimonials = [
    {
      role: "ENGINEERING",
      content: "SkillMatch AI made my job hunt so much easier! The gap analysis highlighted exactly what skills I was missing from the job descriptions. Highly recommended!",
      initials: "AM",
      name: "Aarav Mehta",
      title: "Final Year Student, IIT Bombay"
    },
    {
      role: "PRODUCT",
      content: "I loved how easy it was to customize my resume for different product roles. The interface is intuitive and the NLP matching is incredibly accurate.",
      initials: "SR",
      name: "Sneha Reddy",
      title: "Product Manager, Bangalore"
    },
    {
      role: "TECHNOLOGY",
      content: "The BERT similarity scoring gave my resume a professional edge. Recruiters complimented my exact keyword matches. SkillMatch is a game changer!",
      initials: "RG",
      name: "Rohan Gupta",
      title: "Senior Software Engineer, Hyderabad"
    }
  ];

  return (
    <div className="home-wrapper">
      
      {/* HERO SECTION */}
      <section className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Match Your Resume<br/>To Any Job In Seconds</h1>
          <p className="hero-subtitle">
            Create professional, ATS-friendly resumes in minutes without rewriting endless drafts. 
            Stand out with precision AI matching and land your dream job.
          </p>
          
          <ul className="hero-checklist">
            <li><CheckCircle2 className="check-icon" /> Guaranteed ATS friendly formatting</li>
            <li><CheckCircle2 className="check-icon" /> Identify missing skills & gaps instantly</li>
            <li><CheckCircle2 className="check-icon" /> Powered by advanced NLP & BERT Similarity</li>
            <li><CheckCircle2 className="check-icon" /> Unlimited scans: Tailor your story indefinitely</li>
          </ul>

          <div className="hero-cta-box">
            <button className="cta-button" onClick={() => navigate('/analyze')}>
              🚀 Analyze Your Resume
            </button>
          </div>

          <div className="trusted-by">
            <p>Trusted by employees at</p>
            <div className="logos-row">
              <span className="mock-logo">facebook</span> • 
              <span className="mock-logo">amazon</span> • 
              <span className="mock-logo">NETFLIX</span> • 
              <span className="mock-logo">Google</span> • 
              <span className="mock-logo">Microsoft</span>
            </div>
          </div>
        </div>

        <div className="hero-image-mock">
          {/* Abstract geometric replacement for the illustration */}
          <div className="abstract-card">
            <div className="skeleton-line w-3/4"></div>
            <div className="skeleton-line w-full mt-4"></div>
            <div className="skeleton-line w-5/6 mt-2"></div>
            <div className="skeleton-badge mt-6">Match Score: 98%</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <p className="section-sub">Thousands of job seekers have found success with our AI engine.</p>
        
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="test-card" key={idx}>
              <div className="test-card-header">
                <span className="role-badge">{t.role}</span>
                <span className="stars">★★★★★</span>
              </div>
              <p className="test-content">{t.content}</p>
              <div className="test-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-title">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p className="section-sub">Find answers to the most common questions about our AI matcher.</p>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className="faq-item" key={idx}>
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                {faq.q}
                {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>

        <div className="support-cta">
          <p>Still have questions?</p>
          <button className="support-btn" onClick={() => navigate('/contact')}>Contact Support</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lampzi-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🌟 SkillMatch AI</div>
            <p className="footer-desc">
              <strong>AI Resume Matcher</strong><br/>
              Compare your resume against any job description instantly to find skill gaps and optimize for ATS and recruiters.
            </p>
            <p className="mt-4">Made with ❤️ in India 🇮🇳</p>
          </div>
          
          <div className="footer-links">
            <h4>ANALYSIS</h4>
            <a href="/analyze">Analyze Resume</a>
            <a href="/my-resumes">Analysis History</a>
            <a href="/tips">Optimization Tips</a>
            <a href="/contact">Suggest Skills</a>
          </div>

          <div className="footer-links">
            <h4>OUR COMPANY</h4>
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Pricing</a>
          </div>

          <div className="footer-links">
            <h4>SUPPORT</h4>
            <a href="#">FAQ</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          © 2026 SkillMatch AI. All Rights Reserved.
        </div>
      </footer>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        mode="contact"
      />
    </div>
  );
}
