import express, { Application } from "express";
import errorHandler from "../../../packages/error/errorhandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

app.get("/healthCheck", (_, res) => {
  res.status(200).json({
    message: "Server is healthy!",
  });
});

app.use("/", authRoutes);

app.use(errorHandler);
export default app;
