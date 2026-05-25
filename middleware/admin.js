module.exports = (req, res, next) => {
  try {
    // 🔐 check user exist + role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};