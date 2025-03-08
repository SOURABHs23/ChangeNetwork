import express from "express";
import { getLogs } from "../controllers/logController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("Admin"), getLogs);

export default router;
