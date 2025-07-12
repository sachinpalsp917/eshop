import mongoose from "mongoose";
import { MONGO_URI } from "./env";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Connected To Database");
  } catch (error) {
    console.error("Error connecting to Database: ", error);
    process.exit(1);
  }
};
