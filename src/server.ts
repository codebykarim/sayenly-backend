import "./bootstrap";
import "express-async-errors";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import pkg from "body-parser";
import path from "path";
import { config } from "dotenv";
import AppError from "./errors/AppError";
import routes from "./routes";
import { ErrorMeta } from "./utils/logger";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { processUpcomingBookingReminders } from "./utils/scheduler";
import * as schedule from "node-schedule";
import swaggerSpec from "./utils/swagger";
import { apiReference } from "@scalar/express-api-reference";

config();

const app: Application = express();
app.all("/api/auth/*", toNodeHandler(auth));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(pkg.urlencoded({ extended: true }));
app.use(pkg.json());
app.set("trust proxy", true);

app.use(
  "/api/docs",
  process.env.NODE_ENV === "development"
    ? apiReference({
        spec: {
          content: swaggerSpec,
        },
        title: "Saynly API",
        theme: "default",
        logo: {
          url: "/logo.png",
          altText: "Saynly Logo",
        },
      })
    : (req: Request, res: Response) => {
        res.status(200).json({ status: "ok" });
      }
);

// Keep the JSON endpoint for direct access to the OpenAPI spec
app.get("/api/docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api", routes);

// Custom error interface that might include meta information
interface ExtendedError extends Error {
  meta?: Record<string, any>;
  statusCode?: number;
}

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error(err);
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "INTERNAL_ERROR";
  const extendedError = err as ExtendedError;

  res.status(statusCode).json({
    statusCode,
    message,
    ...(extendedError.meta && { meta: extendedError.meta }),
  });
});

app.all("*", async (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Schedule daily booking reminders at 9:00 AM
try {
  schedule.scheduleJob("0 9 * * *", async () => {
    console.log("Running scheduled task: Processing booking reminders");
    try {
      const count = await processUpcomingBookingReminders();
      console.log(`Sent ${count} booking reminders`);
    } catch (error) {
      console.error("Failed to process booking reminders:", error);
    }
  });
  console.log("Scheduled task added: Daily booking reminders at 9:00 AM");
} catch (error) {
  console.error("Failed to schedule booking reminders task:", error);
}

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`🚀 Server ready on port ${port}`);
  console.log(
    `📚 API Documentation available at http://localhost:${port}/api/docs`
  );
  console.log(
    `Better Auth API Reference available at http://localhost:${port}/api/auth/reference`
  );
});
