//backed/app.js
const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const app = express();
require("./connection/connection");

const auth = require("./routes/auth");
const list = require("./routes/list");

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://todo.vercel.app",
    "https://todo-eww6nj1cz-dhanraj-singhs-projects.vercel.app",
    "https://todo-neon-delta.vercel.app",
    "https://todo-fcc7vj8au-dhanraj-singhs-projects.vercel.app",
    "https://todo-ber8v5yez-dhanraj-singhs-projects.vercel.app",
    "https://your-latest-vercel-app-url.vercel.app" // 替换为最新的 Vercel 应用 URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("hello");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`✅ server started on port ${PORT}`);
});