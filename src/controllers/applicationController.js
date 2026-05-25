import Application from "../models/Application.js";
import Log from "../models/Log.js";
export const getApplications = async (req, res) => {
  const apps = await Application.find({ developer: req.developer._id });
  res.json(apps);
};
export const getApplicationByName = async (req, res) => {
  const app = await Application.findOne({
    name: req.params.name,
    developer: req.developer._id,
  });
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json(app);
};
export const createApplication = async (req, res) => {
  const { name } = req.body; 
  const existing = await Application.findOne({ name });
  if (existing)
    return res.status(400).json({ message: "Application name already taken" });
  const app = await Application.create({ name, developer: req.developer._id });
  res.status(201).json(app); 
};
export const deleteApplication = async (req, res) => {
  const app = await Application.findOne({
    name: req.params.name,
    developer: req.developer._id,
  });
  if (!app) return res.status(404).json({ message: "Application not found" });
  await Log.deleteMany({ application: app._id });
  await app.deleteOne();
  res.json({ message: "Application and its logs deleted" });
};
