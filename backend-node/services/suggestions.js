const skillGraph = {
  "python": ["pandas", "numpy", "machine learning"],
  "machine learning": ["deep learning", "tensorflow"],
  "aws": ["docker", "kubernetes"],
  "react": ["redux", "nextjs"]
};

exports.recommend = (missing) => {
  const rec = [];
  missing.forEach(skill => {
    if (skillGraph[skill]) {
      rec.push(...skillGraph[skill]);
    }
  });
  return [...new Set(rec)];
};

exports.resources = (missing) => {
  const res = [];
  missing.slice(0, 5).forEach(skill => {
    res.push(`Coursera: Search for '${skill}'`);
    res.push(`YouTube: '${skill}' Crash Course`);
  });
  return res;
};
