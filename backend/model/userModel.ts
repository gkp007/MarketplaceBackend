import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
    maxlength: [30, "Can't exceed 30 characters"],
    minlength: [4, "Name should be greater than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Enter your mobile number"],
    unique: true,
    maxlength: [15, "Number can be a maximum of 15 digits"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
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
  otpExpires: Date, // Expiry time for OTP
});

// JWT token
userSchema.methods.getJWTToken = function (): string {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIER as string,
  });
};

export default mongoose.model("User", userSchema);
