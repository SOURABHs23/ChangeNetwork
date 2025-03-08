import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import connectDB from "./config/db.js";
// import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/logs", logRoutes);
// Error Handler
// app.use(errorHandler);

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
