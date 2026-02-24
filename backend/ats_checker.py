def calculate_ats_score(match_score, resume_skills, jd_skills, resume_text):

    # 1️⃣ Keyword similarity weight (40%)
    keyword_score = (match_score / 100) * 40

    # 2️⃣ Skill match weight (30%)
    if len(jd_skills) > 0:
        skill_match_ratio = len(resume_skills) / len(jd_skills)
    else:
        skill_match_ratio = 0

    skill_score = min(skill_match_ratio, 1) * 30

    # 3️⃣ Important sections (20%)
    sections = ["education", "skills", "experience", "projects"]
    section_found = sum([1 for sec in sections if sec in resume_text.lower()])
    section_score = (section_found / len(sections)) * 20

    # 4️⃣ Skill strength (10%)
    skill_strength = min(len(resume_skills) / 10, 1) * 10

    total_score = keyword_score + skill_score + section_score + skill_strength

    return round(total_score, 2)