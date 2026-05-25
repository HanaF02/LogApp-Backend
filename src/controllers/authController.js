import Developer from "../models/Developer.js";
import jwt from "jsonwebtoken";
const generateToken = (
  id, 
) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, 
};
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const exists = await Developer.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      const field = exists.email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already in use` });
    }
    const developer = await Developer.create({ username, email, password });
    const token = generateToken(developer._id); 
    res.cookie("token", token, cookieOptions); 
    res.status(201).json({
      _id: developer._id,
      username: developer.username,
      email: developer.email,
      apiKey: developer.apiKey,
    });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const developer = await Developer.findOne({ email });
    if (!developer || !(await developer.matchPassword(password))) {
      //not found or wrong cred
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(developer._id); 
    res.cookie("token", token, cookieOptions);
    res.json({
      _id: developer._id,
      username: developer.username,
      email: developer.email,
      apiKey: developer.apiKey,
    });
  } catch (err) {
    next(err);
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
