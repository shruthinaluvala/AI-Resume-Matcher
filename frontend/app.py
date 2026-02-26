import streamlit as st
import requests

API_URL = "http://127.0.0.1:5000"

st.set_page_config(page_title="SkillMatch AI", layout="wide")

# ---------------- SESSION ----------------
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "token" not in st.session_state:
    st.session_state.token = None
if "page" not in st.session_state:
    st.session_state.page = "landing"
if "theme" not in st.session_state:
    st.session_state.theme = "dark"

# ---------------- THEME ----------------
def apply_theme():
    
    if st.session_state.theme == "dark":
        bg = "#0f172a"
        text = "white"
        btn_bg = "#1e293b"
        btn_text = "white"
        border = "#334155"

    else:
        bg = "#f8fafc"
        text = "#0f172a"
        btn_bg = "#ffffff"
        btn_text = "#0f172a"
        border = "#cbd5e1"

    st.markdown(f"""
    <style>
    .stApp {{
        background:{bg};
        color:{text};
    }}

    div.stButton > button {{
        background:{btn_bg};
        color:{btn_text};
        border:1px solid {border};
        padding:10px 18px;
        border-radius:10px;
        font-weight:600;
    }}

    div.stButton > button:hover {{
        border:1px solid #6366f1;
        color:#6366f1;
    }}

    input, textarea {{
        color:{text} !important;
    }}

    label {{
        color:{text} !important;
    }}

    /* CENTER BUTTON CSS */
    .center-btn {{
        display:flex;
        justify-content:center;
        margin-top:25px;
    }}

    </style>
    """, unsafe_allow_html=True)

apply_theme()

# ---------------- NAVBAR ----------------
def top_navbar():

    def toggle_theme():
        st.session_state.theme = (
            "light" if st.session_state.theme == "dark" else "dark"
        )
        st.rerun()

    col1, col2, col3 = st.columns([2,6,2])

    with col1:
        st.markdown("### 🧠 SkillMatch AI")

    with col2:
        c1, c2, c3 = st.columns(3)
        with c1:
            if st.button("Home", key="nav_home"):
                st.session_state.page = "landing"
        with c2:
            if st.button("Analyze", key="nav_analyze"):
                go_protected("analysis")
        with c3:
            if st.button("Dashboard", key="nav_dashboard"):
                go_protected("dashboard")

    with col3:
        if st.button("🌗 Theme", key="theme_btn"):
            toggle_theme()

# ---------------- SIDEBAR ----------------
def sidebar():
    st.sidebar.title("📊 Dashboard")

    if st.sidebar.button("🏠 Overview", key="side_overview"):
        st.session_state.page = "dashboard"

    if st.sidebar.button("🔍 Resume Analyzer", key="side_analyze"):
        st.session_state.page = "analysis"

    if st.sidebar.button("🏆 ATS Checker", key="side_ats"):
        st.session_state.page = "ats"

    if st.sidebar.button("🚪 Logout", key="side_logout"):
        logout()

# ---------------- LANDING PAGE ----------------
def landing_page():
    top_navbar()

    dark = st.session_state.theme == "dark"

    bg_card = "#1e293b" if dark else "#ffffff"
    text_main = "white" if dark else "#0f172a"
    text_sub = "#cbd5e1" if dark else "#475569"
    accent = "#6366f1"

    st.markdown(f"""
    <style>
    .hero {{
        text-align:center;
        padding:90px 20px 50px 20px;
    }}

    .hero-title {{
        font-size:64px;
        font-weight:800;
        line-height:1.1;
        color:{text_main};
    }}

    .gradient {{
        background: linear-gradient(90deg,#6366f1,#8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }}

    .hero-sub {{
        font-size:20px;
        color:{text_sub};
        max-width:850px;
        margin:auto;
        margin-top:20px;
    }}

    .stats {{
        display:flex;
        justify-content:center;
        gap:60px;
        margin-top:40px;
        font-size:20px;
        font-weight:600;
        color:{accent};
    }}

    .card {{
        background:{bg_card};
        padding:30px;
        border-radius:18px;
        border:1px solid rgba(120,120,120,0.15);
        transition:0.3s;
    }}

    .card:hover {{
        transform:translateY(-8px);
        border:1px solid {accent};
        box-shadow:0px 10px 25px rgba(0,0,0,0.3);
    }}

    .testimonial {{
        background:{bg_card};
        padding:25px;
        border-radius:16px;
        border:1px solid rgba(120,120,120,0.15);
    }}
    </style>
    """, unsafe_allow_html=True)

    st.markdown(f"""
    <div class="hero">
        <div class="hero-title">
            Stop guessing.<br>
            <span class="gradient">Start learning smart.</span>
        </div>

        <div class="hero-sub">
            SkillMatch AI compares your resume with job descriptions,
            calculates match score, detects missing skills,
            and suggests exactly what to learn next —
            including an advanced ATS compatibility score.
        </div>
    </div>
    """, unsafe_allow_html=True)

    # CENTER BUTTON TOP
    st.markdown('<div class="center-btn">', unsafe_allow_html=True)
    if st.button("🚀 Analyze My Resume", key="home_analyze"):
        go_protected("analysis")
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown(f"""
    <div class="stats">
        <div>✔ AI Powered</div>
        <div>✔ ATS Scoring</div>
        <div>✔ Skill Gap Detection</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("<br><br>", unsafe_allow_html=True)

    st.markdown("## 🔥 Core Capabilities")

    c1, c2 = st.columns(2)

    with c1:
        st.markdown("""<div class="card"><h3>🏆 ATS Compatibility Score</h3>
        <p>Evaluates resume performance in ATS systems.</p></div>""", unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("""<div class="card"><h3>🎯 Resume vs JD Matching</h3>
        <p>Uses cosine similarity to calculate job fit.</p></div>""", unsafe_allow_html=True)

    with c2:
        st.markdown("""<div class="card"><h3>📊 Skill Gap Detection</h3>
        <p>Identifies missing skills required for the job.</p></div>""", unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("""<div class="card"><h3>🧠 Intelligent Suggestions</h3>
        <p>Recommends what to learn to improve match score.</p></div>""", unsafe_allow_html=True)

    st.markdown("<br><br>", unsafe_allow_html=True)

    # CENTER BUTTON BOTTOM
    st.markdown('<div class="center-btn">', unsafe_allow_html=True)
    if st.button("🔥 Start Analysis", key="start_analysis"):
        go_protected("analysis")
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br><br>", unsafe_allow_html=True)
    st.markdown("<center style='opacity:0.5;'>© 2026 SkillMatch AI — Created by Sruthi Naluvala</center>", unsafe_allow_html=True)

# ---------------- ANALYSIS PAGE ----------------
def analysis_page():
    top_navbar()
    sidebar()

    st.title("🔍 Resume Analyzer")

    resume = st.file_uploader("Upload Resume", type=["pdf","docx","txt"])
    jd = st.file_uploader("Upload Job Description", type=["pdf","docx","txt"])

    st.markdown("<br>", unsafe_allow_html=True)

    # CENTER ANALYZE BUTTON
    st.markdown('<div class="center-btn">', unsafe_allow_html=True)
    if st.button("🔍 Analyze Resume", key="main_analyze_btn"):
        if resume and jd:
            headers = {"Authorization": f"Bearer {st.session_state.token}"}
            files = {"resume": resume, "jd": jd}

            res = requests.post(f"{API_URL}/analyze",
                                headers=headers,
                                files=files)

            if res.status_code == 200:
              data = res.json()
              st.session_state.analysis_data = data
              
              st.info(f"🎯 Match Score: {data['match_score']}%")

    # -------- MATCHED SKILLS --------
    if data.get("matched_skills"):
            st.success("✅ Matching Skills:")
            for skill in data["matched_skills"]:
             st.markdown(f"- 🟢 {skill}")

    # -------- MISSING SKILLS --------
    if data.get("missing_skills"):
        st.warning("❌ Missing Skills:")
        for skill in data["missing_skills"]:
            st.markdown(f"- 🔴 {skill}")

    # -------- SKILL SUGGESTIONS --------
    if data.get("missing_skills"):
        st.info("📘 Recommended Skill Suggestions:")
        for skill in data["missing_skills"]:
            st.markdown(f"""
            🔹 **Learn {skill}**
            - Focus on fundamentals  
            - Build 1 mini project  
            - Practice interview questions  
            """)
                
        # else:
        #         st.error("Analysis failed.")
    else:
            st.warning("Upload both Resume and Job Description")
    st.markdown('</div>', unsafe_allow_html=True)

# ---------------- AUTH PAGE ----------------
def auth_page():
    top_navbar()
    st.title("🔐 Login / Signup")

    tab1, tab2 = st.tabs(["Login", "Signup"])

    with tab1:
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")

        if st.button("Login", key="login_btn"):
            res = requests.post(
                f"{API_URL}/login",
                json={"email": email, "password": password}
            )

            if res.status_code == 200:
                data = res.json()
                if "access_token" in data:
                    st.session_state.logged_in = True
                    st.session_state.token = data["access_token"]
                    st.session_state.page = "dashboard"
                    st.success("Login successful!")
                    st.rerun()
                else:
                    st.error("Login failed.")
            else:
                st.error("Invalid credentials")

    with tab2:
        email = st.text_input("New Email")
        password = st.text_input("New Password", type="password")

        if st.button("Register", key="register_btn"):
            res = requests.post(
                f"{API_URL}/register",
                json={"email": email, "password": password}
            )
            if res.status_code == 200:
                st.success("Registration successful! Please login.")
            else:
                st.error("Registration failed")


# ---------------- DASHBOARD ----------------
def dashboard_page():
    top_navbar()
    sidebar()

    st.title("📊 Overview")

    c1, c2, c3 = st.columns(3)
    c1.metric("Total Analyses", "24")
    c2.metric("Avg Match Score", "72%")
    c3.metric("ATS Avg Score", "78")

    st.info("Upload resume to begin intelligent career analysis.")


# ---------------- ATS PAGE ----------------
def ats_page():
    top_navbar()
    sidebar()

    st.title("🏆 ATS Checker")

    if "analysis_data" not in st.session_state:
        st.warning("⚠ Please analyze resume first")
        return

    data = st.session_state.analysis_data

    if not data:
        st.warning("⚠ No analysis data found")
        return

    ats_score = data.get("ats_score")

    if ats_score is None:
        st.error("ATS score missing from backend")
        st.write(data)
        return

    st.success(f"🏆 ATS Score: {ats_score}/100")

    if ats_score < 40:
        st.error("🔴 Poor ATS Resume")
    elif ats_score < 70:
        st.warning("🟡 Average ATS Resume")
    else:
        st.success("🟢 Strong ATS Resume")

    

# ---------------- ROUTING ----------------
def go_protected(page):
    if not st.session_state.logged_in:
        st.session_state.page = "auth"
    else:
        st.session_state.page = page

def logout():
    st.session_state.logged_in = False
    st.session_state.token = None
    st.session_state.page = "landing"
    st.rerun()

if st.session_state.page == "landing":
    landing_page()
elif st.session_state.page == "analysis":
    analysis_page()
elif st.session_state.page == "dashboard":
    dashboard_page()
elif st.session_state.page == "auth":
    auth_page()
elif st.session_state.page == "ats":
    ats_page()