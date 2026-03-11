const skillsDb = [
  "python", "java", "sql", "html", "css", "javascript",
  "react", "node", "flask", "django", "machine learning",
  "deep learning", "nlp", "data science", "aws", "docker",
  "kubernetes", "power bi", "excel", "git", "linux", "c++",
  "express", "mongo", "mongodb", "postgresql"
];

exports.extract = (text) => {
  const safeText = text || '';
  const normalizedText = safeText.toString().toLowerCase();
  const found = [];

  skillsDb.forEach((skill) => {
    if (normalizedText.includes(skill)) {
      found.push(skill);
    }
  });

  return [...new Set(found)];
};
