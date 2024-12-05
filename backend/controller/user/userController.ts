import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHnadeler";
import Business from "../../model/businessModel";
import InquiryModel from "../../model/InquiryModel";
import mongoose from "mongoose";
import RatingModel from "../../model/RatingModel";
import User from "../../model/userModel";

// Add Rating
export const addRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { Bid, Uid } = req.params;
  const { rating, message, userID } = req.body;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorHandler("Rating must be between 1 and 5", 400));
    }

    if (message && message.length > 500) {
      return next(
        new ErrorHandler("Message cannot exceed 500 characters", 400)
      );
    }

    // Check if the business exists
    const business = await Business.findById(Bid);
    if (!business) return next(new ErrorHandler("Business not found", 404));

    // Create and save the new rating
    const newRating = await RatingModel.create({
      user: userID,
      business: Uid,
      rating,
      message,
    });
    await newRating.save();

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      rating: newRating,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

// Make Inquiry
export const makeInquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { BUid } = req.params;
  try {
    const inquiry = await InquiryModel.create({
      ...req.body,
      user: BUid,
    });
    res.status(201).json({ success: true, data: inquiry });
  } catch (error: any) {
    new ErrorHandler(error.message || "Internal Server Erroe", 500);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User Not Found", 404));

    if (name) user.name = name;

    if (avatar && typeof avatar === "object") {
      user.avatar = user.avatar || { public_id: "", url: "" };
      if (avatar.public_id) user.avatar.public_id = avatar.public_id;
      if (avatar.url) user.avatar.url = avatar.url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};
