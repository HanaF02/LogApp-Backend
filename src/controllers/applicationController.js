import Application from "../models/Application.js";
import Log from "../models/Log.js";
//crud for a dev's applications
export const getApplications = async (req, res) => {
  const apps = await Application.find({ developer: req.developer._id });
  res.json(apps);
};
export const getApplicationByName = async (req, res) => {
  const app = await Application.findOne({
    name: req.params.name,
    developer: req.developer._id, //eshm3na not params~
  });
  if (!app) return res.status(404).json({ message: "Application not found" });
  res.json(app);
};
export const createApplication = async (req, res) => {
  const { name } = req.body; //user gives new app name
  const existing = await Application.findOne({ name });
  if (existing)
    return res.status(400).json({ message: "Application name already taken" });
  const app = await Application.create({ name, developer: req.developer._id });
  res.status(201).json(app); //send status then? show it bardo?? sends data as json res and client must parse to js object to see
};
export const deleteApplication = async (req, res) => {
  const app = await Application.findOne({
    name: req.params.name,
    developer: req.developer._id,
  });
  if (!app) return res.status(404).json({ message: "Application not found" });
  // Delete all logs belonging to this app too
  await Log.deleteMany({ application: app._id });//the logs
  await app.deleteOne();//app nafso
  res.json({ message: "Application and its logs deleted" });
};
