import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config();// Load environment variables from .env file
const PORT = process.env.PORT || 5000;
connectDB().then(() => { // Connect to the database and then start the server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
