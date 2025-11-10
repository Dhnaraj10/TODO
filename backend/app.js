//backed/app.js
const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const app = express();
const mongoose = require("mongoose"); // For health check
require("./connection/connection");

const auth = require("./routes/auth");
const list = require("./routes/list");

// Use a more flexible CORS configuration with regex for Vercel domains
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://todo.vercel.app"
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Check if it's a Vercel deployment (matches pattern *.vercel.app)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    // Log blocked origins for debugging
    console.log(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

// Add a route for manifest.json to prevent 401 errors
app.get('/manifest.json', (req, res) => {
  res.status(200).json({
    "short_name": "TODO App",
    "name": "TODO Application",
    "icons": [],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const status = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: {
      connected: mongoStatus === 1,
      connecting: mongoStatus === 2,
      disconnecting: mongoStatus === 3,
      disconnected: mongoStatus === 0,
      status: mongoStatus
    },
    uptime: process.uptime()
  };
  
  if (mongoStatus === 1) {
    status.mongodb.host = mongoose.connection.host;
    status.mongodb.name = mongoose.connection.name;
  }
  
  res.status(mongoStatus === 1 ? 200 : 503).json(status);
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.get('Origin') || 'no-origin'}`);
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