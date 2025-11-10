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
    "https://todo.vercel.app"
  ],
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