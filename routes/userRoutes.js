const express = require("express");

const router = express.Router();

// Import Controllers
const {
    register,
    login
} = require("../controllers/userController");

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

module.exports = router;