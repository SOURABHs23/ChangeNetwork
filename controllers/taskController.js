import Task from "../models/Task.js";
import User from "../models/User.js";
import {
  sendTaskAssignmentEmail,
  sendTaskStatusUpdateEmail,
} from "../services/emailService.js";

import { logAction } from "../services/loggingService.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      console.log(assignedUser);

      if (!assignedUser) {
        return res.status(404).json({ message: "Assigned user not found" });
      }

      const task = new Task({
        title,
        description,
        dueDate,
        assignedTo,
        createdBy: req.user._id,
      });
      await task.save();
      // Send email notification to assigned user
      await sendTaskAssignmentEmail(assignedUser.email, title, req.user.name);
      // Log the action
      await logAction("Task created", task._id, req.user);
      res.status(201).json(task);
    } else {
      res.status(400).json({ message: "Assigned user ID is required" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!status) return res.status(400).json({ message: "Status is required" });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only Admin can update any task's status; users can only update their own
    if (!isAdmin(req.user) && !isTaskOwner(req.user, task)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this task status" });
    }

    task.status = status;
    await task.save();
    const assignedUser = await User.findById(task.assignedTo);
    await sendTaskStatusUpdateEmail(assignedUser.email, task.title, status);
    await logAction("Task status updated", task._id, req.user);

    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task status" });
  }
};

export const assignTaskToUser = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findById(req.params.id);

    if (!assignedTo)
      return res.status(400).json({ message: "Assigned user ID is required" });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only Admin or Task Creator can assign a task
    if (!isAdmin(req.user) && !isTaskOwner(req.user, task)) {
      return res.status(403).json({ message: "Unauthorized to assign task" });
    }

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    task.assignedTo = assignedTo;
    await task.save();

    await sendTaskAssignmentEmail(
      assignedUser.email,
      task.title,
      req.user.name
    );

    await logAction("Task assigned", task._id, req.user);

    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    console.log(task);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!isAdmin(req.user) && !isTaskOwner(req.user, task))
      return res.status(403).json({ message: "Unauthorized" });
    await Task.deleteOne({ _id: task._id });
    await logAction("Task deleted", task._id, req.user);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Check if the user is an Admin
const isAdmin = (user) => {
  return user.role === "Admin";
};

// Check if the user is the owner of the task
const isTaskOwner = (user, task) => {
  return task.createdBy.toString() === user._id.toString();
};

// Update full task (for Admin)
// const updateTaskFully = async (task, updates) => {
//   Object.assign(task, updates);
//   await task.save();
//   return task;
// };
