import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("performedBy", "name email");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving logs" });
  }
};
