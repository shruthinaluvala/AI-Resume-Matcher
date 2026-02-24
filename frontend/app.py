import streamlit as st
import requests

API_URL = "http://127.0.0.1:5000"

st.set_page_config(page_title="AI Resume Matcher", layout="wide")

# ---------- SESSION STATE ----------
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "token" not in st.session_state:
    st.session_state.token = None
if "page" not in st.session_state:
    st.session_state.page = "landing"


# ---------- LANDING PAGE ----------
def landing_page():
    st.title("🚀 Resume Match & Skill Suggester")
    st.write("AI-powered ATS Resume Analyzer")

    col1, col2, col3 = st.columns(3)

    if col1.button("🔍 Analysis"):
        go_protected("analysis")

    if col2.button("🏆 ATS Checker"):
        go_protected("analysis")

    if col3.button("📊 Skill Gap"):
        go_protected("analysis")


# ---------- AUTH PAGE ----------
def auth_page():
    st.title("🔐 Login / Signup")

    tab1, tab2 = st.tabs(["Login", "Signup"])

    with tab1:
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")

        if st.button("Login"):
            res = requests.post(f"{API_URL}/login",
                                json={"email": email, "password": password})
            if res.status_code == 200:
                st.session_state.logged_in = True
                st.session_state.token = res.json()["access_token"]
                st.session_state.page = "analysis"
                st.success("Login successful!")
                st.rerun()
            else:
                st.error("Invalid credentials")

    with tab2:
        email = st.text_input("New Email")
        password = st.text_input("New Password", type="password")

        if st.button("Register"):
            res = requests.post(f"{API_URL}/register",
                                json={"email": email, "password": password})
            if res.status_code == 200:
                st.success("Registration successful! Please login.")
            else:
                st.error("Registration failed")


# ---------- ANALYSIS PAGE ----------
def analysis_page():
    st.sidebar.title("Dashboard")
    st.sidebar.button("Logout", on_click=logout)

    st.title("🔍 Resume Analysis")

    resume = st.file_uploader("Upload Resume", type=["pdf","docx","txt"])
    jd = st.file_uploader("Upload Job Description", type=["pdf","docx","txt"])

    if st.button("Analyze"):
        if resume and jd:
            headers = {
                "Authorization": f"Bearer {st.session_state.token}"
            }

            files = {"resume": resume, "jd": jd}

            res = requests.post(f"{API_URL}/analyze",
                                headers=headers,
                                files=files)

            if res.status_code == 200:
                data = res.json()

                st.subheader("🏆 ATS Score")
                st.write(data["ats_score"])

                st.subheader("🎯 Match Score")
                st.write(data["match_score"])

                st.subheader("❌ Missing Skills")
                st.write(data["missing_skills"])

            else:
                st.error("Analysis failed. Check backend.")


# ---------- LOGIC ----------
def go_protected(target_page):
    if not st.session_state.logged_in:
        st.session_state.page = "auth"
    else:
        st.session_state.page = target_page


def logout():
    st.session_state.logged_in = False
    st.session_state.token = None
    st.session_state.page = "landing"
    st.rerun()


# ---------- ROUTING ----------
if st.session_state.page == "landing":
    landing_page()

elif st.session_state.page == "auth":
    auth_page()

elif st.session_state.page == "analysis":
    analysis_page()