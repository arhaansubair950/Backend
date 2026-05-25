const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// CORS setup - allows your frontend ports
const corsOptions = {
  origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://4mc5jg3p-3001.inc1.devtunnels.ms",
  "https://qbrl81gb-5000.inc1.devtunnels.ms",
],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// DB connect
const connectDB = require("./config/db");
connectDB();

// User routes
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
});