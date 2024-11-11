import { Request, Response, NextFunction } from "express";
import agencyModel from "../model/agencyModel";
import ErrorHandler from "../utils/errorHnadeler";
import { sendEmail } from "../utils/sendEmail";

export const sendagencyMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile, email, message } = req.body;

    if (!name || !mobile || !email || !message) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const agencyMessage = new agencyModel({
      name,
      mobile,
      email,
      message,
    });
    await sendEmail({
      email,
      subject: "Message Received",
      message: `Hello ${name},\n\nWe have received your message. Our team will reach out to you shortly.\n\nBest regards,\nThe Agency Team`,
    });
    await agencyMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      agencyMessage,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Failed to send message", 500)
    );
  }
};
