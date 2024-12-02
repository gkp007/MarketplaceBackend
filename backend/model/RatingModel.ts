import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import "dotenv/config";

interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  rating: number;
  message: string;
  createdAt: Date;
}

const ratingSchema = new mongoose.Schema<IRating>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business ID is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, "Message cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RatingModel = mongoose.model<IRating>("Rating", ratingSchema);
export default RatingModel;
