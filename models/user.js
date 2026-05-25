const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true // 🔥 duplicate email prevent
  },

  password: {
    type: String,
    required: true,
    select: false // 🔥 password default aayi hide cheyyum
  },

  // 👑 ROLE
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);