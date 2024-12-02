import mongoose, { Document, Schema } from "mongoose";

export interface IOffer extends Document {
  businessOwner: mongoose.Schema.Types.ObjectId;
  business: mongoose.Schema.Types.ObjectId;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: Date;
  endDate: Date;
}

const offerSchema = new mongoose.Schema<IOffer>({
    businessOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Offer description is required"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
);

const offerModel = mongoose.model<IOffer>("Offer", offerSchema);
export default offerModel;
