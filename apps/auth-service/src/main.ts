import "dotenv/config";
import app from "./app";
import { connectToDatabase } from "../../../packages/config/db";
import { Server } from "http";

const PORT = process.env.PORT || 6001;
let server: Server;
const startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`🚀 MS-AUTH: Server running on port: ${PORT}`);
      connectToDatabase();
    });
  } catch (error) {
    console.error("💣 MS-AUTH: Database connection failed:", error);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  console.log("🔒 MS-AUTH: Shutting down server gracefully...");

  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log("🔐 MS-AUTH: Server closed");
  }

  console.log("🏦 MS-AUTH: Database connection closed");
  process.exit(0);
};

process.on("SIGINT", shutdown);
