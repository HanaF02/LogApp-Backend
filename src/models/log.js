import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"], // Restrict log levels to INFO, WARN, and ERROR for consistent log categorization and easier filtering based on severity
      required: true,
    },
    count: { type: Number, default: 1 }, // Default count is 1, increment for duplicates
    application: {
      //reference to the application model also as application is linked to the developer we can link logs to developers through applications and manage them accordingly
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevents duplicate logs — same message+level in same app = increment count
logSchema.index({ message: 1, level: 1, application: 1 }, { unique: true }); // Create a unique index on the combination of message, level, and application to prevent duplicate log entries for the same message and level within the same application, ensuring that instead of creating multiple entries for the same log, we can simply increment the count for existing logs, improving efficiency and reducing clutter in the log database.

export default mongoose.model("Log", logSchema);
