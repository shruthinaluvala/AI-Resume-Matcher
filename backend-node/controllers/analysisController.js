const resumeParser = require("../services/resumeParser");
const similarityEngine = require("../services/similarityEngine");
const skillExtractor = require("../services/skillExtractor");
const suggestions = require("../services/suggestions");
const atsScore = require("../services/atsScore");

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jdText } = req.body;
    let finalResumeText = resumeText || "";
    let finalJdText = jdText || "";

    // Parse files if they were uploaded
    if (req.files) {
      if (req.files.resume) {
        finalResumeText = await resumeParser.extractText(req.files.resume[0]);
      }
      if (req.files.jd) {
        finalJdText = await resumeParser.extractText(req.files.jd[0]);
      }
    }

    if (!finalResumeText || !finalJdText) {
      return res.status(400).json({ error: "Please provide both Resume and Job Description (via text OR file upload)" });
    }

    // 1. Extract Skills
    const resumeSkills = skillExtractor.extract(finalResumeText);
    const jdSkills = skillExtractor.extract(finalJdText);

    // 2. Compute Similarities
    const matchScore = similarityEngine.calculateCosine(finalResumeText, finalJdText);
    const bertMock = matchScore; // Mocking BERT logic without heavy python modules
    const tfidfMock = matchScore; 

    // 3. Compute ATS Score
    const ats = atsScore.calculate(matchScore, resumeSkills, jdSkills, finalResumeText);

    // 4. Identify gaps
    const matchedSkills = jdSkills.filter(s => resumeSkills.includes(s));
    const missingSkills = jdSkills.filter(s => !resumeSkills.includes(s));

    // 5. Generate Suggestions
    const recommendedSkills = suggestions.recommend(missingSkills);
    const resources = suggestions.resources(missingSkills);

    // 6. Regenerate texts
    const regeneratedResume = resumeParser.regenerate(finalResumeText, missingSkills);

    res.json({
      ats_score: ats,
      match_score: matchScore,
      bert_similarity: bertMock,
      tfidf_similarity: tfidfMock,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      recommended_skills: recommendedSkills,
      resources: resources,
      regenerated_resume: regeneratedResume,
      regenerated_jd: finalJdText
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed", details: err.message });
  }
};
