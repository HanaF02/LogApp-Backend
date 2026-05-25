import jwt from "jsonwebtoken";
import Developer from "../models/Developer.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token; // Check for token in cookies first, then check Authorization header for Bearer token if not found in cookies

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      // Check if the Authorization header exists and starts with "Bearer", indicating a token is present in the header , &&
      token = req.headers.authorization.split(" ")[1]; // Extract the token from the Authorization header by splitting the header value and taking the second part (the token itself) after "Bearer"
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key defined in the environment variable JWT_SECRET, which ensures that the token is valid and has not been tampered with, allowing us to decode the token and access its payload (such as the developer's ID) for authentication purposes
    req.developer = await Developer.findById(decoded.id).select("-password"); // Find the developer in the database using the ID from the decoded token and attach the developer object to the request object (req.developer) for use in subsequent middleware or route handlers, while excluding the password field for security reasons

    if (!req.developer) {
      return res.status(401).json({ message: "Developer not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
////////////////////////////
//Questions:
//what is && is it like in react or just javascript in general?
//what is req.dev and req.cookies
//do we need to omit anything else other than password??
