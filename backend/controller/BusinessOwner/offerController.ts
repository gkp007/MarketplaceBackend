import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHnadeler";
import offerModel from "../../model/offerModel";
import Business from "../../model/businessModel";

export const createOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id, business_id } = req.query;

  try {
    const { description, discountType, discountValue, startDate, endDate } =
      req.body;

    if (
      !description ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate
    ) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Validate if the business exists
    const business = await Business.findById(business_id);
    if (!business) {
      return next(new ErrorHandler("Business not found", 404));
    }

    // Create the offer
    const offer = new offerModel({
      businessOwner: user_id,
      business: business_id,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Failed to create offer", 500)
    );
  }
};

export const getOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const offers = await offerModel.find({ business: id });

    if (!offers) {
      return next(new ErrorHandler("Offer not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Offer Get successfully",
      offers,
    });
  } catch (error: any) {
    return next(
      new ErrorHandler(error.message || "Internal Server Error", 500)
    );
  }
};
