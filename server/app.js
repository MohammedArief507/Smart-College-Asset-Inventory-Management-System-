import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import laboratoryRoutes from "./routes/laboratory.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import requestRoutes from "./routes/request.routes.js";
import reportRoutes from "./routes/report.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

const app = express();

// Trust proxy (needed for Render)
app.set("trust proxy", 1);

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Try again later." },
}));

// CORS — allow both local and production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "✅ Smart Asset API is running!",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/v1/auth",          authRoutes);
app.use("/api/v1/users",         userRoutes);
app.use("/api/v1/departments",   departmentRoutes);
app.use("/api/v1/laboratories",  laboratoryRoutes);
app.use("/api/v1/assets",        assetRoutes);
app.use("/api/v1/requests",      requestRoutes);
app.use("/api/v1/reports",       reportRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
