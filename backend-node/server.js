const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", analysisRoutes);

// Mock Auth Routes for the Matcher
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }

  // Accept any login for demo purposes
  res.json({
    token: "mock-jwt-token-123456",
    user: { email, name: email.split('@')[0] } 
  });
});

app.post("/api/google-login", (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Google auth failed." });
  }
  res.json({
    token: "mock-jwt-google-auth",
    user: { email, name }
  });
});

app.post("/api/signup", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  res.json({
    token: "mock-jwt-token-78910",
    user: { email, name } 
  });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke internally!", details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
