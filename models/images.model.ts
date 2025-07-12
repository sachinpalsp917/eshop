import mongoose from "mongoose";

export interface ImagesDocument extends mongoose.Document {
  id: string;
  file_id: string;
  url: string;
  userId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
}

const ImagesSchema = new mongoose.Schema<ImagesDocument>({
  file_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    default: "https://placehold.co/600x400",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

const ImagesModel = mongoose.model<ImagesDocument>("Image", ImagesSchema);

export default ImagesModel;
