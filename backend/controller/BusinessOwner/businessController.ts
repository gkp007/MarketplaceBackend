import { Request, Response, NextFunction, RequestHandler } from "express";
import Business from "../../model/businessModel";
import ErrorHandler from "../../utils/errorHnadeler";
import "dotenv/config";
import InquiryModel from "../../model/InquiryModel";
import User from "../../model/userModel";
import axios from "axios";
import path from "path";
import { getPresignedPutUrl } from "../../middleware/uploadFile";

export const createBusinessProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.params;

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

    if (!businessName ||!location ||!mobileNumber ||!BusinessOpenDate ||!category ||!serviceList) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find user
    const findUser = await User.findById(user_id);
    if (!findUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check for existing business
    let business = await Business.findOne({ owner: findUser._id });

    if (business) {
      // Updating existing business
      if (business.GSTNO !== GSTNO && GSTNO) {
        return next(new ErrorHandler("GST number cannot be changed", 400));
      }


      const uploadedPhotos = photos || business.photos || [];
      if (req.files && req.files.photos) {
        const fileArray = Array.isArray(req.files.photos)
          ? req.files.photos
          : [req.files.photos];

        for (const photoFile of fileArray) {
          const fileKey = `businesses/${user_id}/${path.basename(photoFile.name)}`;
          const presignedUrlResult = await getPresignedPutUrl(
            fileKey,
            photoFile.mimetype
          );

          if (!presignedUrlResult.success) {
            throw new Error(
              presignedUrlResult.error || "Failed to generate pre-signed URL"
            );
          }

          await axios.put(presignedUrlResult.url!, photoFile.data, {
            headers: {
              "Content-Type": photoFile.mimetype,
            },
          });

          uploadedPhotos.push({
            public_id: fileKey,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
          });
        }
      }

      // Update business fields
      business.businessName = businessName;
      business.location = location;
      business.mobileNumber = mobileNumber;
      business.webSiteLink = webSiteLink || business.webSiteLink;
      business.BusinessOpenDate = BusinessOpenDate;
      business.category = category;
      business.serviceList = serviceList;
      business.photos = uploadedPhotos;

      await business.save();

      res.status(200).json({
        success: true,
        message: "Business updated successfully",
        business,
      });
    } else {
      // Create new business
      if (!GSTNO) {
        return next(
          new ErrorHandler("GST number is required for creation", 400)
        );
      }

      const newBusiness = new Business({
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

      await newBusiness.save();

      res.status(201).json({
        success: true,
        message: "Business created successfully",
        business: newBusiness,
      });
    }
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Failed to process request", 500));
  }
};

export const getBusinessProfile=async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const { user_id } = req.params;
  try {
    const getBusniess = await Business.findOne({owner: user_id });
    res.status(201).json({
      success: true,
      getBusniess,
    });
  } catch (error:any) {
    new ErrorHandler(error.message || "Internal Server Error", 500)
  }
}

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
