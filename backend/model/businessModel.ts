import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import "dotenv/config";

interface Ibusiness extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  businessName: string;
  location: string;
  mobileNumber: string;
  webSiteLink: string;
  BusinessOpenDate: Date;
  GSTNO: string;
  category: string;
  serviceList: string[];
  photos: {
    public_id: string;
    url: string;
  }[];
  offers: string[];
  isVerified: boolean;
}

const businessSchema = new mongoose.Schema<Ibusiness>({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    required: [true, "Business name is required"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    minlength: [3, "Name should be at least 3 characters"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    validate: {
      validator: (value: string) => validator.isMobilePhone(value),
      message: "Please enter a valid mobile number",
    },
  },
  webSiteLink: {
    type: String,
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: "Please enter a valid website URL",
    },
  },
  BusinessOpenDate: {
    type: Date,
    required: [true, "Year in business is required"],
  },
  GSTNO: {
    type: String,
    required: [true, "GST number is required"],
    unique: true,
    validate: {
      validator: (value: string) =>
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      message: "Please enter a valid GST number",
    },
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  serviceList: {
    type: [String],
    required: [true, "Service list is required"],
  },
  photos: [
    {
      public_id: {
        type: String,
        required: [true, "Photo public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Photo URL is required"],
        validate: {
          validator: (value: string) => validator.isURL(value),
          message: "Please enter a valid URL for the photo",
        },
      },
    },
  ],
  offers: { type: [String], default: [] },
  isVerified: { type: Boolean, default: false },
});

const Business = mongoose.model<Ibusiness>("Business", businessSchema);
export default Business;
