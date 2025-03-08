import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Task Created", "Task Updated", "Task Deleted"
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // Task reference
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who performed the action
  timestamp: { type: Date, default: Date.now }, // When the action occurred
});

export default mongoose.model("Log", LogSchema);
