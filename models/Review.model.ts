import mongoose from "mongoose";

export interface shopReviews extends mongoose.Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  rating: number;
  reviews: string;
  shopId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<shopReviews>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {
      type: String,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<shopReviews>("Review", reviewSchema);
