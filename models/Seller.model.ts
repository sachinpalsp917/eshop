import mongoose from "mongoose";
import { ShopModel, ShopsDocument } from "./Shop.model";

export interface SellerDocument extends mongoose.Document {
  id: String;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  password?: string;
  stripe_id?: string;
  shop?: ShopsDocument;
  shop_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new mongoose.Schema<SellerDocument>(
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
    phone_number: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    stripe_id: {
      type: String,
    },
    shop: {
      type: ShopModel,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

export const SellerModel = mongoose.model<SellerDocument>(
  "Seller",
  SellerSchema
);
