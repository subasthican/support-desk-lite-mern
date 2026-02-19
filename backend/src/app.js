const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: { message: "Support Desk Lite API running" },
    error: null
  });
});

module.exports = app;
