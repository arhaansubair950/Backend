const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendInvite = require("../utils/sendInvite");

// 🟢 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: "user",
      isVerified: true,
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        token: jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        ),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: "Invalid login" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📧 INVITE USER
exports.inviteUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email,
      role: role || "user",
      inviteToken,
      inviteExpires,
      isVerified: false,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}&email=${email}`;
    await sendInvite({ to: email, name, inviteLink });

    res.json({ message: "Invite sent successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 SET PASSWORD
exports.setPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    const user = await User.findOne({
      email,
      inviteToken: token,
      inviteExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite link" });
    }

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.inviteToken = undefined;
    user.inviteExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.json({ message: "Password set! You can now login." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};