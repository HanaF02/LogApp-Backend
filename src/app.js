import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express(); // Create an Express application

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS for the specified client URL and allow credentials (cookies) to be sent in cross-origin requests
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(express.json()); // Middleware to parse incoming JSON requests and make the data available in req.body
app.use(cookieParser()); // Middleware to parse cookies from incoming requests and make them available in req.cookies

app.use("/api/users", authRoutes); // Use the authRoutes for any requests to /api/users, which will handle user authentication and related operations
app.use("/api/applications", logRoutes); // Use the logRoutes for any requests to /api/logs, which will handle log-related operations
app.use("/api/applications", applicationRoutes); // Use the applicationRoutes for any requests to /api/applications, which will handle operations related to applications

app.use(errorHandler); // Use the custom error handling middleware to catch and handle errors that occur in the application
export default app; // Export the Express application for use in server.js, where it will be imported and used to start the server
