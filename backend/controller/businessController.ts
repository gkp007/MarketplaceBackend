import { Request, Response, NextFunction } from "express";
import Business from "../model/businessModel";
import ErrorHandler from "../utils/errorHnadeler";
import "dotenv/config";

export const businessCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      location,
      mobileNumber,
      webSiteLink,
      YearInBusiness,
      GSTNO,
      category,
      serviceList,
      photo,
    } = req.body;

    if (!name || !location || !mobileNumber || !YearInBusiness || !GSTNO || !category || !serviceList || !photo) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const existingBusiness = await Business.findOne({
      $or: [{ GSTNO }, { mobileNumber }],
    });
    if (existingBusiness) {
      return next(new ErrorHandler("Business with this GST number or mobile number already exists", 400));
    }

    const business = new Business({
      name,
      location,
      mobileNumber,
      webSiteLink,
      YearInBusiness,
      GSTNO,
      category,
      serviceList,
      photo,
    });
    await business.save();

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Failed to create business", 500));
  }
};
