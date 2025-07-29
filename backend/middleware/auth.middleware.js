import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || "defaultSecret";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Auth Header:", authHeader); // 👈 Add this

  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token extracted:", token); // 👈 Add this

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded); // 👈 Add this
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // 👈 Add this
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
