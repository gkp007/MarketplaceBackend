import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

interface IInquiry extends Document {
  number: string;
  message: string;
  businessOner: mongoose.Schema.Types.ObjectId;
}

const InquirySchema = new Schema<IInquiry>({
  number: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    validate: {
      validator: (value: string) => validator.isMobilePhone(value),
      message: "Please enter a valid mobile number",
    },
  },
  message: { type: String, required: true },
  businessOner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
});

export default mongoose.model<IInquiry>("Inquiry", InquirySchema);
