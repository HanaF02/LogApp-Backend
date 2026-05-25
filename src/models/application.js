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
        message: "Application name cannot contain whitespace", //add more?
      },
    },
    developer: { //add reference to developer model, each application belongs to a developer so that way we can link applications to developers and manage them accordingly
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the Developer model
      ref: "Developer", // Reference the Developer model to establish a relationship between applications and developers
      required: true, // Ensure that each application is associated with a developer, making it mandatory to link applications to developers for proper management and organization
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model("Application", applicationSchema);
