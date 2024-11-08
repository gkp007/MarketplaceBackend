import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
    maxlength: [30, "can't exceed 30 char"],
    minlength: [4, "name should have grater then  4 char"],
  },
  email: {
    type: String,
    required: [true, "Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Enter your mobile number"],
    maxlength: [12, "Number max be 12 digits"],
    minlength: [10, "Number min be 10 digits"],
  },
  phone2: {
    type: Number,
    maxlength: [12, "Number max be 12 digits"],
    minlength: [10, "Number min be 10 digits"],
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
});


// JWT token
userSchema.methods.getJWTToken = function (): string {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIER as string,
  });
};


export default mongoose.model("user", userSchema);
