import express from "express";
import {
  createTask,
  updateTaskStatus,
  assignTaskToUser,
  deleteTask,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, createTask);
// router.put("/:id", authMiddleware, updateTask);
router.patch("/:id/status", authMiddleware, updateTaskStatus);
router.patch("/:id/assign", authMiddleware, assignTaskToUser);
router.delete("/:id/delete", authMiddleware, deleteTask);

export default router;
