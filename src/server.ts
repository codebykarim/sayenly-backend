import "./bootstrap";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pkg from "body-parser";
import path from "path";
const { urlencoded } = pkg;
const { json } = pkg;
import AppError from "./errors/AppError";
import routes from "./routes";
import { ErrorMeta } from "./utils/logger";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(json());
app.set("trust proxy", true);

app.use(routes);

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  let errorMeta: ErrorMeta = {
    url: req.url,
    body: req.body,
    agent: req.headers["user-agent"],
    key: "INTERNAL_SERVER_ERROR",
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  };

  if (req.user?.id !== undefined) {
    errorMeta.uid = req.user.id;
  }

  if (err instanceof AppError) {
    errorMeta.code = err.statusCode;
    errorMeta.key = err.message;
    // LogError(errorMeta);

    return res.status(err.statusCode).json({ error: err.message });
  }

  errorMeta.code = 500;
  errorMeta.message = err.message;

  console.log(errorMeta);

  // LogError(errorMeta);

  return res.status(500).json({ error: errorMeta.key });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const port = process.env.PORT ?? 3000;

app.listen(port as any, "0.0.0.0", async () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
