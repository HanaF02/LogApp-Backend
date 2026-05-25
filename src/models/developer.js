import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const developerSchema = new mongoose.Schema({
  // Developer schema with unique username and email
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  apiKey: { type: String, unique: true, default: () => uuidv4() }, // Generate unique API key using UUID v4
});

// Hash password before saving
developerSchema.pre("save", async function (next) {
  // Hash password before saving to the database, why next in paramater
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10 for security
  // next(); // Call next to proceed with saving the document after hashing the password
});

// Helper method to compare passwords at login
developerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the hashed password stored in the database, returning true if they match and false otherwise
};

export default mongoose.model("Developer", developerSchema); //export the dev model takes name and schema name as paramaters
