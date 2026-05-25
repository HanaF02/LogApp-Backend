import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => !/\s/.test(v),
        message: "Application name cannot contain whitespace", 
      },
    },
    developer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Developer", 
      required: true, 
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model("Application", applicationSchema);
