//backed/app.js
const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const app = express();
require("./connection/connection");

const auth = require("./routes/auth");
const list = require("./routes/list");

app.use(cors({
  origin: "http://localhost:3000", // ✅ Allow React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(1000, () => {
  console.log("✅ server started on port 1000");
});
