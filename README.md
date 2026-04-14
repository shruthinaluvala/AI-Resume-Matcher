# 🚀 SkillMatch AI - Resume Analyzer & Optimizer
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Deployed on Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
An intelligent full-stack application that analyzes resumes against Job Descriptions (JDs) using NLP-based skill extraction and semantic similarity calculations. It helps candidates optimize their resumes to pass ATS (Applicant Tracking Systems) checks, identifies skill gaps, and auto-generates 100% matched, ATS-friendly resumes.
## ✨ Key Features
- **Intelligent Parsing:** Supports file uploads (PDF/Docx/TXT) or direct copy-pasting for Resumes and Job Descriptions.
- **Advanced NLP Matching:** Calculates BERT-style semantic similarity, Match Scores, and ATS compatibility out of 100.
- **Skill Gap Analysis:** Immediately identifies exactly which skills you overlap with the JD, and which ones you are missing.
- **Resource Recommendations:** Automatically suggests YouTube, Coursera, or Web resources to learn your missing skills.
- **ATS Resume Auto-Builder:** Taking your existing data and injecting matched keywords to perfectly align with the target JD while offering beautiful ATS-standard templates (Modern, Minimalist, Executive).
- **LaTeX Source Export:** Instantly download the generated resume as a PDF or copy the pure LaTeX code to compile in Overleaf.
- **Authentication:** Full login, signup, and Google Account OAuth simulation.
## 🛠️ Tech Stack
**Frontend:**
- React (built with Vite)
- Normal CSS (Vanilla CSS for maximum styling control)
- Lucide React (for modern iconography)
- Axios & React Router
**Backend:**
- Node.js & Express.js
- Custom NLP pipelines (Skill extraction and Cosine Similarity Engines)
- CORS & automated mock JWT implementations
## 🚀 Live Demo
- **Frontend** hosted on Vercel
- **Backend API** hosted on Render
## 💻 Running Locally
### 1. Clone the repository
```bash
git clone https://github.com/shruthinaluvala/AI-Resume-Matcher.git
cd AI-Resume-Matcher
```
### 2. Setup the Backend
Open a terminal and run the following:
```bash
cd backend-node
npm install
node server.js
```
*The backend will run on `http://localhost:5001/`*
### 3. Setup the Frontend
Open a new terminal window and run:
```bash
cd frontend-react
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173/`*
## 📁 Repository Structure
```
AI-Resume-Matcher/
├── backend-node/
│   ├── controllers/      # Route controllers (Analysis, Auth)
│   ├── routes/           # Express API routes
│   ├── services/         # Core NLP and similarity engines
│   └── server.js         # Entry point for express server
└── frontend-react/
    ├── src/
    │   ├── components/   # Reusable UI components (Google Auth, Navbars, Modals)
    │   ├── pages/        # Main route pages (Home, Analyze, Login)
    │   ├── App.jsx       # Root router component
    │   └── main.jsx      # React injection point
    └── vite.config.js    # Vite configuration
```
## ☁️ Deployment Guides
This repository is configured for easy deployment on **Vercel** (Frontend) and **Render** (Backend).
**Backend on Render:** Deploy the repository as a Web Service setting the Root Directory to `backend-node` and using `node server.js` as the start command.
**Frontend on Vercel:** Deploy the project connecting the Git repo, setting the Root directory to `frontend-react`, and injecting the environment variable `VITE_API_URL` pointing to your live Render API URL (ensuring it ends with `/api`).
## 📜 License
This project is for educational and portfolio purposes.
