import mongoose, { Document, Schema } from "mongoose";

interface IRating extends Document {
  rating: number;
  message: String;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const RatingSchema = new mongoose.Schema<IRating>({
  rating: { required: true },
  message: { required: true },
  user: { ref: "User", required: true },
  createdAt: Date,
});

const UserRatingModel = mongoose.model<IRating>("Rating", RatingSchema);
export default UserRatingModel;
