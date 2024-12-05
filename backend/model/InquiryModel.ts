import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

interface IInquiry extends Document {
  number: string;
  message: string;
  businessOner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  number: {
    type: String,
    required: [true, "Mobile number is required"],
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
  createdAt: {type: Date},
});

const InquiryModel = mongoose.model<IInquiry>("Inquiry", InquirySchema);
export default InquiryModel;
