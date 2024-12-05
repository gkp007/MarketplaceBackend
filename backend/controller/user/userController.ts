import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHnadeler";
import Business from "../../model/businessModel";
import InquiryModel from "../../model/InquiryModel";
import RatingModel from "../../model/RatingModel";
import User from "../../model/userModel";
import { createKolkataTime } from "../../config/createKolkataTime";
import WatchlistModel from "../../model/WatchlistModel";
import { AuthenticatedRequest } from "../../types/express";
import mongoose from "mongoose";

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
      createdAt: createKolkataTime(),
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

// update profile
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

// whatchlict toggle
export const toggleWatchlist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessID } = req.params;
    const userID = req.user?._id;

    const businessObjectId = new mongoose.Types.ObjectId(businessID);

    let watchlist = await WatchlistModel.findOne({ userID });

    if (!watchlist) {
      watchlist = new WatchlistModel({
        userID,
        businessIDs: [businessObjectId],
        createdAt: new Date(),
      });
    } else {
      const businessIDsAsString = watchlist.businessIDs.map(id => id.toString());
      
      if (businessIDsAsString.includes(businessObjectId.toString())) {
        watchlist.businessIDs = watchlist.businessIDs.filter((businessId: any) =>businessId.toString() !== businessObjectId.toString());
      } else {
        watchlist.businessIDs.push(businessObjectId as any);
      }
    }

    await watchlist.save();

    res.status(200).json({
      success: true,
      message: "Watchlist updated successfully",
      watchlist,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Failed to toggle watchlist", 500));
  }
};

//get watchlist
export const getWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.params.id;

    const watchlist = await WatchlistModel.findOne({ userID }).populate(
      "businessIDs"
    );

    if (!watchlist) {
      return next(new ErrorHandler("Watchlist not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Watchlist fetched successfully",
      watchlist,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Failed to fetch watchlist", 500));
  }
};
