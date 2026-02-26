import "express-async-errors";
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";
import { courseRouter } from "./routes/course.routes";
import { lessonRouter } from "./routes/lesson.routes";
import { enrollmentRouter } from "./routes/enrollment.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Serve static video files: GET /videos/filename.mp4
app.use("/videos", express.static(path.join(__dirname, "../public/videos"), {
  setHeaders: (res) => {
    res.set("Accept-Ranges", "bytes");
  },
}));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/enrollments", enrollmentRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
