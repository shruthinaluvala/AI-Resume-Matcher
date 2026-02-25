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
        card = "#1e293b"
    else:
        bg = "#f8fafc"
        text = "#0f172a"
        card = "white"

    st.markdown(f"""
    <style>
    .stApp {{
        background: {bg};
        color: {text};
    }}

    .hero-title {{
        font-size:56px;
        font-weight:800;
    }}

    .feature-card {{
        background:{card};
        padding:30px;
        border-radius:16px;
        border:1px solid rgba(120,120,120,0.2);
        transition:0.3s;
    }}

    .feature-card:hover {{
        transform:translateY(-6px);
        border:1px solid #6366f1;
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
            if st.button("Home"):
                st.session_state.page = "landing"
        with c2:
            if st.button("Analyze"):
                go_protected("analysis")
        with c3:
            if st.button("Dashboard"):
                go_protected("dashboard")

    with col3:
        if st.button("🌗 Theme"):
            toggle_theme()

# ---------------- SIDEBAR ----------------
def sidebar():
    st.sidebar.title("📊 Dashboard")

    if st.sidebar.button("🏠 Overview"):
        st.session_state.page = "dashboard"

    if st.sidebar.button("🔍 Resume Analyzer"):
        st.session_state.page = "analysis"

    if st.sidebar.button("🏆 ATS Checker"):
        st.session_state.page = "ats"

    if st.sidebar.button("🚪 Logout"):
        logout()

# ---------------- LANDING PAGE ----------------
def landing_page():
    top_navbar()

    st.markdown("""
    <div style="text-align:center;padding:100px 20px;">
        <div class="hero-title">
            SkillMatch AI — Resume Matcher & Skill Gap Analyzer
        </div>
        <br>
        <p style="font-size:20px;opacity:0.8;">
        An AI system that compares resumes with job descriptions,
        calculates match score, detects missing skills,
        suggests what to learn next — and provides ATS compatibility score.
        </p>
        <br>
        <p style="opacity:0.6;">Created by Sruthi Naluvala</p>
    </div>
    """, unsafe_allow_html=True)

    col = st.columns([1,2,1])[1]
    with col:
        if st.button("🚀 Start Smart Analysis"):
            go_protected("analysis")

    st.markdown("## 🔥 Core Features")

    c1, c2 = st.columns(2)

    with c1:
        if st.button("🧠 NLP Skill Extraction"):
            st.success("Uses spaCy + NLTK + TF-IDF for preprocessing.")

        if st.button("🎯 Resume vs JD Matching"):
            st.success("Cosine similarity calculates job fit percentage.")

    with c2:
        if st.button("📊 Skill Gap Detection"):
            st.success("Identifies missing skills for target job.")

        if st.button("🏆 ATS Compatibility Score"):
            st.success("Evaluates resume ATS performance.")

    st.markdown("---")
    st.markdown(
        "<center style='opacity:0.5;'>© 2026 SkillMatch AI</center>",
        unsafe_allow_html=True
    )

# ---------------- AUTH PAGE ----------------
def auth_page():
    top_navbar()
    st.title("🔐 Login / Signup")

    tab1, tab2 = st.tabs(["Login", "Signup"])

    with tab1:
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")

        if st.button("Login"):
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
                st.error("Invalid credentials.")

    with tab2:
        email = st.text_input("New Email")
        password = st.text_input("New Password", type="password")

        if st.button("Register"):
            res = requests.post(
                f"{API_URL}/register",
                json={"email": email, "password": password}
            )
            if res.status_code == 200:
                st.success("Registration successful! Please login.")
            else:
                st.error("Registration failed.")

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

# ---------------- ANALYSIS PAGE ----------------
def analysis_page():
    top_navbar()
    sidebar()

    st.title("🔍 Resume Analyzer")

    resume = st.file_uploader("Upload Resume", type=["pdf","docx","txt"])
    jd = st.file_uploader("Upload Job Description", type=["pdf","docx","txt"])

    if st.button("Analyze"):
        if resume and jd:
            headers = {
                "Authorization": f"Bearer {st.session_state.token}"
            }

            files = {"resume": resume, "jd": jd}

            res = requests.post(
                f"{API_URL}/analyze",
                headers=headers,
                files=files
            )

            if res.status_code == 200:
                data = res.json()

                st.success(f"🏆 ATS Score: {data['ats_score']}/100")
                st.info(f"🎯 Match Score: {data['match_score']}%")
                st.warning(f"❌ Missing Skills: {data['missing_skills']}")
            else:
                st.error("Analysis failed.")

# ---------------- ATS PAGE ----------------
def ats_page():
    top_navbar()
    sidebar()

    st.title("🏆 ATS Checker")

    resume = st.file_uploader("Upload Resume", type=["pdf","docx","txt"])

    if st.button("Check ATS"):
        st.info("ATS scoring based on resume structure and keyword match.")

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
elif st.session_state.page == "auth":
    auth_page()
elif st.session_state.page == "dashboard":
    dashboard_page()
elif st.session_state.page == "analysis":
    analysis_page()
elif st.session_state.page == "ats":
    ats_page()