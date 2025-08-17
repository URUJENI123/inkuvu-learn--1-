import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import net from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import resourceRoutes from "./routes/resources.js";
import uploadRoutes from "./routes/upload.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FALLBACK_PORTS = [5000, 5001, 5002, 5003, 8000, 8001, 3001];

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const checkDatabaseConnection = async () => {
  try {
    // Database connection will be handled by Prisma
    console.log("Database connection will be managed by Prisma");
    console.log(
      "Make sure to run 'npx prisma migrate dev' to set up the database"
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Inkuvu Learn Backend is running with PostgreSQL",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const findAvailablePort = (startPort, callback) => {
  const server = net.createServer();

  server.listen(startPort, () => {
    const port = server.address().port;
    server.close(() => callback(null, port));
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      // Try next port in fallback list
      const currentIndex = FALLBACK_PORTS.indexOf(startPort);
      const nextPort = FALLBACK_PORTS[currentIndex + 1];

      if (nextPort) {
        console.log(`Port ${startPort} is in use, trying port ${nextPort}...`);
        findAvailablePort(nextPort, callback);
      } else {
        callback(new Error("No available ports found"));
      }
    } else {
      callback(err);
    }
  });
};

const startServer = async () => {
  try {
    await checkDatabaseConnection();

    const availablePort = await new Promise((resolve, reject) => {
      findAvailablePort(PORT, (err, port) => {
        if (err) reject(err);
        else resolve(port);
      });
    });

    app.listen(availablePort, () => {
      console.log(
        ` Inkuvu Learn Backend is running on port ${availablePort}`
      );
      console.log(` Uploads directory: ${uploadsDir}`);
      console.log(
        ` Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }`
      );
      console.log(
        ` Health check: http://localhost:${availablePort}/api/health`
      );

      if (availablePort !== PORT) {
        console.log(
          `  Note: Default port ${PORT} was in use, using port ${availablePort} instead`
        );
      }
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    console.log(
      " Try stopping other processes using these ports or restart your computer"
    );
    process.exit(1);
  }
};

// Start the server
startServer();
