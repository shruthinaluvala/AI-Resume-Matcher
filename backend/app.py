from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from flask_jwt_extended import JWTManager
from ats_checker import calculate_ats_score
import PyPDF2
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from auth import auth   # auth file

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)
# register auth routes
from auth import auth
app.register_blueprint(auth)

# load NLP model
nlp = spacy.load("en_core_web_sm")

# ---------------- FILE TEXT EXTRACT ----------------
def extract_text(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            if page.extract_text():
                text += page.extract_text()
        return text

    elif filename.endswith(".docx"):
        doc = docx.Document(file)
        return " ".join([p.text for p in doc.paragraphs])

    elif filename.endswith(".txt"):
        return file.read().decode("utf-8")

    else:
        return ""


# ---------------- TEXT PREPROCESS ----------------
def preprocess_text(text):
    doc = nlp(text.lower())
    tokens = [token.text for token in doc if not token.is_stop and token.is_alpha]
    return " ".join(tokens)


# ---------------- SKILL EXTRACTION ----------------
def extract_skills(text):
    skills_db = [
        "python","java","sql","html","css","javascript",
        "react","node","flask","django",
        "machine learning","deep learning","nlp","data science",
        "aws","docker","power bi","excel"
    ]

    text = text.lower()
    found = []

    for skill in skills_db:
        if skill in text:
            found.append(skill)

    return list(set(found))


# ---------------- MATCH SCORE ----------------
def calculate_match(resume_text, jd_text):
    tfidf = TfidfVectorizer()
    vectors = tfidf.fit_transform([resume_text, jd_text])
    score = cosine_similarity(vectors)[0][1]
    return round(score * 100, 2)


# ---------------- ANALYZE API ----------------
@app.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files or "jd" not in request.files:
        return jsonify({"error": "Upload resume and job description"}), 400

    resume_file = request.files["resume"]
    jd_file = request.files["jd"]

    resume_text = extract_text(resume_file)
    jd_text = extract_text(jd_file)

    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)

    resume_skills = extract_skills(clean_resume)
    jd_skills = extract_skills(clean_jd)

    missing_skills = list(set(jd_skills) - set(resume_skills))
    match_score = calculate_match(clean_resume, clean_jd)
    ats_score = calculate_ats_score(
    match_score,
    resume_skills,
    jd_skills,
    resume_text
    )
    return jsonify({
        "match_score": match_score,
        "ats_score": ats_score,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "missing_skills": missing_skills,
        "processed_resume": clean_resume[:500],
        "processed_jd": clean_jd[:500]
    })


# ---------------- MAIN ----------------
if __name__ == "__main__":
    app.run(debug=True)