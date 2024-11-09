import twilio from "twilio";
import User from "../model/userModel";
import ErrorHandler from "../utils/errorHnadeler";
import { Request, Response, NextFunction } from "express";
import 'dotenv/config'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    // Send OTP via Twilio
    await client.messages.create({
      body: `Your verification code is greate ${otp}`,
      from: process.env.TWILIO_AUTH_TOKEN,
      to: phoneNumber,
    });
    
    
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpires: Date.now() + 5 * 60 * 1000 },
      { new: true, upsert: true }
    );

    if (!user) {
      return next(new ErrorHandler("Failed to send OTP", 401));
    }
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to send OTP", 500));
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.otp === otp && user.otpExpires && user.otpExpires > new Date()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to verify OTP", 500));
  }
};
