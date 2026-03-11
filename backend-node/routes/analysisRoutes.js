const express = require("express");
const router = express.Router();
const multer = require("multer");
const analysisController = require("../controllers/analysisController");

// Multer memory storage (we will parse buffers directly in the process instead of saving them)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/analyze",
  upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'jd', maxCount: 1 }]),
  analysisController.analyzeResume
);

module.exports = router;
