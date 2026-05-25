const express = require("express");
const router = express.Router();

const {
  register,
  login,
  changePassword,
  inviteUser,
  setPassword
} = require("../controllers/userController");

const auth = require("../middleware/Auth");
const admin = require("../middleware/admin");

const User = require("../models/User");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Frontend needs this route
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

// Change password route
router.put("/change-password", auth, changePassword);

// Keep this route for backend testing
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

// Team members route
router.get("/team", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin only route
router.get("/all-users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ← paste here
router.post("/invite", auth, inviteUser);
router.post("/set-password", setPassword);
 // ← this stays last

module.exports = router;