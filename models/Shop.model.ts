import mongoose from "mongoose";
import ImagesModel, { ImagesDocument } from "./images.model";
import { ReviewModel, shopReviews } from "./Review.model";

export interface ShopsDocument extends mongoose.Document {
  id: String;
  name: string;
  bio: string;
  category: string;
  avatar: ImagesDocument;
  coverBanner: string;
  address: string;
  opening_hours: string;
  website: string;
  socailLinks: JSON[];
  ratings: Number;
  reviews: shopReviews[];
  sellerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new mongoose.Schema<ShopsDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    avatar: {
      type: ImagesModel,
    },
    coverBanner: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    opening_hours: {
      type: String,
    },
    website: {
      type: String,
    },
    socailLinks: {
      type: [JSON],
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {
      type: [ReviewModel],
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const ShopModel = mongoose.model<ShopsDocument>("Shop", ShopSchema);
