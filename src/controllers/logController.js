import Log from "../models/Log.js";
import Application from "../models/Application.js";
import Developer from "../models/Developer.js";
export const getLogs = async (req, res) => {
  const {
    level,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
    search,
  } = req.query;

  const app = await Application.findOne({
    name: req.params.name,
    developer: req.developer._id,
  });
  if (!app) return res.status(404).json({ message: "Application not found" });

  const filter = { application: app._id };
  if (level) filter.level = level.toUpperCase();
  if (search) filter.message = { $regex: search, $options: "i" };

  const sortObj = { [sort]: order === "asc" ? 1 : -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    Log.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Log.countDocuments(filter),
  ]);

  res.json({
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    logs,
  });
};
export const postLog = async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ message: "API key required" });
  const developer = await Developer.findOne({ apiKey });
  if (!developer) return res.status(401).json({ message: "Invalid API key" });
  const app = await Application.findOne({
    name: req.params.name,
    developer: developer._id,
  });
  if (!app)
    return res
      .status(403)
      .json({ message: "Access denied to this application" });
  const { message, level } = req.body;
  const log = await Log.findOneAndUpdate(
    { message, level, application: app._id },
    { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
  res.status(201).json(log);
};
