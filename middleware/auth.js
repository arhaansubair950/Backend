const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    // ✅ Remove "Bearer " prefix
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // ✅ Uses JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ CHANGED: store full decoded object so req.user.id works in controllers
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};