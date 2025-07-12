import mongoose from "mongoose";
import { ImagesDocument, ImagesSchema } from "./images.model";

export interface UserDocument extends mongoose.Document {
  id: String;
  name: string;
  email: string;
  password?: string;
  verified: boolean;
  avatar?: ImagesDocument;
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
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: ImagesSchema,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
