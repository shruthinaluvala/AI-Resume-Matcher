exports.calculate = (matchScore, resumeSkills, jdSkills, resumeText) => {
  const safeText = resumeText || '';
  const textStr = safeText.toString().toLowerCase();

  // 1. Check sections (Experience, Education, Skills)
  const sections = ["experience", "education", "skills"];
  const foundSections = sections.filter(s => textStr.includes(s)).length;
  const sectionScore = (foundSections / sections.length) * 100;

  // 2. Formatting compliance (Tables and images cause penalization usually)
  let formattingScore = 100;
  if (textStr.includes("table")) formattingScore -= 20;
  if (textStr.includes("image")) formattingScore -= 20;

  // 3. Keyword/match score mapping
  // We use the generalized cosine match passed from our engine
  
  // Calculate final weighted ATS Score
  const atsScore = (0.5 * matchScore) + (0.3 * formattingScore) + (0.2 * sectionScore);
  
  // Cap at 100 max
  return Math.min(Math.round(atsScore * 100) / 100, 100);
};
