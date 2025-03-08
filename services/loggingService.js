import Log from "../models/Log.js";

export const logAction = async (action, taskId, userId) => {
  try {
    const logEntry = new Log({
      action,
      taskId,
      performedBy: userId,
    });
    await logEntry.save();
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
