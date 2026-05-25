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
    search, // ← was missing
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
// export const getLogs = async (req, res) => {
//   //dashboard
//   const {
//     level,
//     sort = "createdAt",
//     order = "desc",
//     page = 1,
//     limit = 20,
//   } = req.query; //with def vals
//   const app = await Application.findOne({
//     name: req.params.name,
//     developer: req.developer._id,
//   });
//   if (!app) return res.status(404).json({ message: "Application not found" });
//   const filter = { application: app._id }; //We start a query object: "Find logs where the application ID matches this app."
//   if (level) filter.level = level.toUpperCase(); // If the user typed a specific level in the URL (like ?level=error), we transform it to uppercase ("ERROR") and add it to our search folder. Now it searches for logs belonging to this app and matching that error level.
//   if (search) filter.message = { $regex: search, $options: "i" };
//   const sortObj = { [sort]: order === "asc" ? 1 : -1 };
//   const skip = (Number(page) - 1) * Number(limit); //change pages by skipping rows
//   const [logs, total] = await Promise.all([
//     //Promise.all executes both queries simultaneously to save server processing time.
//     Log.find(filter).sort(sortObj).skip(skip).limit(Number(limit)), // Fetch the actual 20 log rows for this specific page
//     Log.countDocuments(filter), // Count the total number of logs this app has in existence.
//   ]);
//   res.json({
//     total,
//     page: Number(page),
//     totalPages: Math.ceil(total / Number(limit)),
//     logs,
//   });
// };
export const postLog = async (req, res) => {
  //////////////////////////SEEEEEEE!!!!!!!!!!!!!!//////////////
  //background worker that catches errors or events sent by your apps and records them in the database
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ message: "API key required" });
  // Find the developer who owns this API key
  const developer = await Developer.findOne({ apiKey });
  if (!developer) return res.status(401).json({ message: "Invalid API key" });
  // Make sure this developer owns the application
  const app = await Application.findOne({
    name: req.params.name,
    developer: developer._id,
  });
  if (!app)
    return res
      .status(403)
      .json({ message: "Access denied to this application" });
  const { message, level } = req.body;
  // Upsert: if same message+level exists, increment count. Otherwise create.
  const log = await Log.findOneAndUpdate(
    { message, level, application: app._id },
    { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
  res.status(201).json(log);
};
