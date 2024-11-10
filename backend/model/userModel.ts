import mongoose, { Document } from "mongoose";
import validator from "validator";
import JWT from "jsonwebtoken";
import 'dotenv/config';

interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  otp?: number;
  otpExpires?: Date;
  emailOtp?: number;
  emailOtpExpires?: Date;
  getJWTToken: () => string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    default:"unknown",
    required: [true, "Enter your name"],
    maxlength: [30, "Can't exceed 30 characters"],
    minlength: [4, "Name should be greater than 4 characters"],
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phoneNumber: {
    type: String,
    unique: true,
    maxlength: [14, "Number can be a maximum of 10 digits"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  otp: {
    type: Number,
    minlength: [6, "OTP must be 6 digits"],
  },
  otpExpires: Date,
  emailOtp: {
    type: Number,
    minlength: [6, "OTP must be 6 digits"],
  },
  emailOtpExpires: Date,
});

// JWT token generation method
userSchema.methods.getJWTToken = function (): string {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIER as string,
  });
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
