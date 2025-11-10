//backed/app.js
const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const app = express();
require("./connection/connection");

const auth = require("./routes/auth");
const list = require("./routes/list");

const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      // Allow all vercel.app domains
      /\.vercel\.app$/,
      // You can add other specific domains here
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches any of our allowed origins
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log(`✅ server started on port ${PORT}`);
});