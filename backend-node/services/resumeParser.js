const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

exports.extractText = async (fileObj) => {
  try {
    const ext = fileObj.originalname.split('.').pop().toLowerCase();
    
    if (ext === "pdf") {
      const data = await pdfParse(fileObj.buffer);
      return data.text;
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: fileObj.buffer });
      return result.value;
    } else if (ext === "txt") {
      return fileObj.buffer.toString("utf-8");
    }
  } catch (err) {
    console.error("Text Extraction Error: ", err);
    return "";
  }
  return "";
};

exports.regenerate = (originalText, missingSkills) => {
  let rebuilt = originalText + "\n\n### AI RECOMMENDED ADDITIONS TO ATS ###\n";
  rebuilt += missingSkills.join(", ");
  return rebuilt;
};
