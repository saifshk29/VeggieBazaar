import express from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { runMigrations } from "./migrate.js";
import { initDatabaseAndSeed } from "./storage.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize database and run migrations
    log("Setting up database...");
    
    // Step 1: Run migrations to create tables
    const migrationsSuccessful = await runMigrations();
    if (!migrationsSuccessful) {
      log("Database migrations failed. Server may not function correctly.");
    } else {
      log("Database migrations completed successfully.");
    }
    
    // Step 2: Initialize database storage and seed data
    const dbInitialized = await initDatabaseAndSeed();
    if (!dbInitialized) {
      log("Database initialization failed. Server may not function correctly.");
    } else {
      log("Database initialization completed successfully.");
    }
    
    // Step 3: Register routes and start the server
    const server = await registerRoutes(app);

    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  } catch (error) {
    log("Error during server initialization:", error);
    process.exit(1);
  }

  // In development or local environment, use port 5000
  // In production (Vercel), the port is provided by the environment
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();