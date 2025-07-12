import mongoose from "mongoose";
import ImagesModel, { ImagesDocument } from "./images.model";

export interface UserDocument extends mongoose.Document {
  id: String;
  name: string;
  email: string;
  password?: string;
  following: string[];
  avatar: ImagesDocument;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    following: {
      type: [String],
      default: [],
    },
    avatar: {
      type: ImagesModel,
      required: false,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
