import { Request, Response, NextFunction } from "express";
import Business from "../../model/businessModel";
import ErrorHandler from "../../utils/errorHnadeler";
import "dotenv/config";
import InquiryModel from "../../model/InquiryModel";
import User from "../../model/userModel";

// create Business
export const createBusinessProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {user_id}  = req.params;
  try {
    const {
      businessName,
      location,
      mobileNumber,
      webSiteLink,
      BusinessOpenDate,
      GSTNO,
      category,
      serviceList,
      photos,
    } = req.body;

    // Validate required fields
    if (
      !businessName ||
      !location ||
      !mobileNumber ||
      !BusinessOpenDate ||
      !GSTNO ||
      !category ||
      !serviceList ||
      !photos
    ) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find the user by ID
    const findUser = await User.findById(user_id);
    if (!findUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if the business already exists
    const existingBusiness = await Business.findOne({
      $or: [{ GSTNO }, { mobileNumber }],
    });
    if (existingBusiness) {
      return next(
        new ErrorHandler(
          "Business with this GST number or mobile number already exists",
          400
        )
      );
    }

    if (!Array.isArray(photos) || photos.some((photo) => !photo.public_id || !photo.url)) {
      return next(
        new ErrorHandler("Photos must be an array of objects with public_id and url", 400)
      );
    }

    const business = new Business({
      owner: findUser._id,
      businessName,
      location,
      mobileNumber,
      webSiteLink: webSiteLink || null,
      BusinessOpenDate,
      GSTNO,
      category,
      serviceList,
      photos,
    });

    await business.save();

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Failed to create business", 500)
    );
  }
};


// get Busuness
export const getBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const totalBusinesses = await Business.countDocuments();

    const businesses = await Business.find().skip(skip).limit(limit);

    if (!businesses || businesses.length === 0) {
      return next(new ErrorHandler("No businesses found", 404));
    }

    res.status(200).json({
      success: true,
      count: businesses.length,
      totalPages: Math.ceil(totalBusinesses / limit),
      currentPage: page,
      data: businesses,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Failed to retrieve businesses", 500)
    );
  }
};

// View All Inquiries
export const getAllInquiries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const inquiries = await InquiryModel.find({ business: id });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Internal Server Error", 500)
    );
  }
};

// Manage Offers
export const addOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { offer } = req.body;
  try {
    const business = await Business.findById(id);
    if (!business) return next(new ErrorHandler("Business not found", 404));

    business.offers.push(offer);
    await business.save();
    res.status(200).json({
      success: true,
      message: "Offer added successfully",
      data: business,
    });
  } catch (error: any) {
    new ErrorHandler(error.message || "Internal Server Error", 500);
  }
};
