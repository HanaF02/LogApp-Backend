import mongoose from "mongoose";
const connectDB = async () => { // Connect to MongoDB using Mongoose
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
export default connectDB; // Export the connectDB function for use in server.js
