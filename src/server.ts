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
const { apiReference } =
  process.env.NODE_ENV === "development"
    ? require("@scalar/express-api-reference")
    : {};

config();

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://dashboard.sayenly.com"], // Remove any undefined values
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/api/send-bookings-reminders", async (req: Request, res: Response) => {
  try {
    const count = await processUpcomingBookingReminders();
    res.status(200).json({
      message: `Sent ${count} booking reminders`,
    });
  } catch (error) {
    throw new AppError("Failed to send reminders ");
  }
});

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
