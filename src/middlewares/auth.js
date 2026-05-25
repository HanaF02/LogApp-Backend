import jwt from "jsonwebtoken";
import Developer from "../models/Developer.js";
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token; 
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; 
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.developer = await Developer.findById(decoded.id).select("-password"); 
    if (!req.developer) {
      return res.status(401).json({ message: "Developer not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
