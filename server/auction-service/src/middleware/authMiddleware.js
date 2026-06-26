import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    console.log("Auth middleware reached");
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email } — set by auth-service when it signed the token
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
