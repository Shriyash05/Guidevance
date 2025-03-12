import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import router from "./routes"; // API routes
import { setupVite, serveStatic, log } from "./vite"; // Vite setup
import cors from "cors";
import http from "http";
import net from "net";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DEFAULT_PORT = 3000;
const MONGODB_URI = process.env.MONGO_URI || "";

// ✅ Ensure MongoDB URI is provided
if (!MONGODB_URI) {
  console.error("❌ MONGO_URI is missing. Set it in .env file.");
  process.exit(1);
}

// ✅ Improved Port Availability Check
const checkPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err: any) => resolve(err.code !== "EADDRINUSE"));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port);
  });
};

// ✅ MongoDB Connection with Auto-Retry
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // ✅ Removed deprecated options
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected. Retrying in 5 seconds...");
      setTimeout(connectToMongoDB, 5000);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

// ✅ API Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const responseStr = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${responseStr.length > 100 ? responseStr.slice(0, 100) + "..." : responseStr}`;
      }
      log(logLine);
    }
  });

  next();
});

// ✅ Use API Router Before Static Serving
app.use("/api", router);

// ✅ Global Error Handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Start Server Function
const startServer = async () => {
  let port = DEFAULT_PORT;

  // ✅ Find an available port if the default is in use
  while (!(await checkPortAvailable(port))) {
    console.warn(`⚠️ Port ${port} in use. Trying port ${port + 1}...`);
    port++;
  }

  await connectToMongoDB();

  const server = http.createServer(app);

  // ✅ Setup Vite (Dev Mode) or Serve Static Files (Prod Mode)
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });

  // ✅ Handle Unexpected Errors
  process.on("unhandledRejection", (err: any) => {
    console.error("❌ Unhandled Rejection:", err.stack || err);
    process.exit(1);
  });

  // ✅ Graceful Shutdown Handling
  process.on("SIGINT", async () => {
    console.log("\n🔻 Shutting down server...");

    server.close(async () => {
      console.log("✅ Server closed.");

      try {
        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed.");
      } catch (error) {
        console.error("❌ Error closing MongoDB connection:", error);
      }

      process.exit(0);
    });
  });
};

// ✅ Run the Server
startServer().catch((error) => {
  console.error("❌ Fatal Error:", error);
  process.exit(1);
});
