import mongoose, { Document } from "mongoose";
import validator from "validator";
import "dotenv/config";

interface Iagency extends Document {
  name: string;
  mobile: string;
  email: string;
  message: string;
}

const agencySchema = new mongoose.Schema<Iagency>({
  name: {
    type: String,
    required: [true, "Business name is required"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    minlength: [3, "Name should be at least 3 characters"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: (value: string) => validator.isMobilePhone(value),
      message: "Please enter a valid mobile number",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  message: {
    type: String,
  },
});

const agencyModel = mongoose.model<Iagency>("Agency", agencySchema);
export default agencyModel;
