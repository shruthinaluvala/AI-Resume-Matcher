// A simple mock for TF-IDF / Cosine Similarity since we aren't using heavy python modules like sklearn.
function getTermFrequency(text) {
  const safeText = text || '';
  const words = safeText.toString().toLowerCase().match(/\b(\w+)\b/g) || [];
  const counts = {};
  words.forEach(w => {
    counts[w] = (counts[w] || 0) + 1;
  });
  return counts;
}

exports.calculateCosine = (text1, text2) => {
  const tf1 = getTermFrequency(text1);
  const tf2 = getTermFrequency(text2);
  
  const allWords = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  allWords.forEach(word => {
    const v1 = tf1[word] || 0;
    const v2 = tf2[word] || 0;
    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;
  });

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  const score = dotProduct / (magnitude1 * magnitude2);
  return Math.round(score * 100);
};
