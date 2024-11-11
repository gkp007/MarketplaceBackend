import twilio from "twilio";
import User from "../model/userModel";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { sendEmail } from "../utils/sendEmail";
import ErrorHandler from "../utils/errorHnadeler";
import { createKolkataTime } from "../config/createKolkataTime";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Send OTP via SMS
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpires: createKolkataTime(10) },
      { new: true, upsert: true }
    );

    if (!user) return next(new ErrorHandler("Failed to send OTP", 401));

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to send OTP", 500));
  }
};

// Verify Mobile OTP
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return next(new ErrorHandler("User not found", 404));
    const currentDate = createKolkataTime();
    if (
      user.otp === otp &&
      user.otpExpires &&
      user.otpExpires > new Date(currentDate)
    ) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = user.getJWTToken();
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully", token });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to verify OTP", 500));
  }
};

// Send OTP via Email
export const sendEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        emailOtp: otp,
        emailOtpExpires: createKolkataTime(10),
      },
      { new: true, upsert: true }
    );

    if (!user) return next(new ErrorHandler("Failed to send OTP", 401));

    await sendEmail({
      email,
      subject: "Verification Code",
      message: `Your email verification code is: ${otp}`,
    });

    res
      .status(200)
      .json({ success: true, message: "OTP sent successfully", email, otp });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to send OTP", 500));
  }
};

// Verify Email OTP
export const emailVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found", 404));
    const currentDate = createKolkataTime();

    if (
      user.emailOtp === otp &&
      user.emailOtpExpires &&
      user.emailOtpExpires > new Date(currentDate)
    ) {
      user.emailOtp = undefined;
      user.emailOtpExpires = undefined;
      await user.save();

      const token = user.getJWTToken();
      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token,
        user,
      });
    } else {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to verify OTP", 500));
  }
};

// logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("token", null);
    
    res.status(200).json({
      success: true,
      message: "Logout Sucessfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to verify OTP", 500));
  }
};
