const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

console.log("Loading server.js...");

// Import routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

console.log("userRoutes loaded");
console.log("taskRoutes loaded");

const app = express();

const corsOptions = {
  origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://4mc5jg3p-3001.inc1.devtunnels.ms",
  "https://qbrl81gb-5000.inc1.devtunnels.ms",
],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:");
    console.log(error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler must stay last
app.use((req, res) => {
  console.log("Route not found:", req.method, req.originalUrl);

  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
});