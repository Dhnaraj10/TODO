//backed/app.js
const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const app = express();
const mongoose = require("mongoose"); // For health check

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
app.get('/health', async (req, res) => {
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
    
    // Test database connectivity
    try {
      await mongoose.connection.db.admin().ping();
      status.mongodb.ping = "successful";
    } catch (err) {
      status.mongodb.ping = "failed";
      status.mongodb.pingError = err.message;
      status.status = "Degraded";
    }
  }
  
  res.status(mongoStatus === 1 ? 200 : 503).json(status);
});

// Database test endpoint
app.get('/db-test', async (req, res) => {
  try {
    console.log("Database test requested");
    
    // Check connection state
    const state = mongoose.connection.readyState;
    console.log("Current connection state:", state);
    
    if (state !== 1) {
      return res.status(503).json({
        status: "error",
        message: "Database not connected",
        state: state,
        states: {
          0: "disconnected",
          1: "connected",
          2: "connecting",
          3: "disconnecting"
        }
      });
    }
    
    // Try to ping the database
    console.log("Attempting to ping database...");
    const pingResult = await mongoose.connection.db.admin().ping();
    console.log("Ping result:", pingResult);
    
    // Try a simple query
    console.log("Attempting a simple query...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    res.json({
      status: "success",
      message: "Database connection is working",
      ping: pingResult,
      collections: collections.map(c => c.name),
      state: state
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database test failed",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
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

// Export the app for use in startup.js
module.exports = app;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ server started on port ${PORT}`);
  });
}