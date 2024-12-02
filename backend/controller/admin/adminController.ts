import Business from "../../model/businessModel";
import User from "../../model/userModel";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHnadeler";

// GET-all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Get all user error", 500));
  }
};

// Block/Unblock User
export const toggleUserBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Error on User Block", 500));
  }
};

// Verify Business Owner
export const verifyBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) return next(new ErrorHandler("Business not found", 404));

    business.isVerified = true;
    await business.save();
    res
      .status(200)
      .json({ success: true, message: "Business verified successfully" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message || "Error on user Verify", 500));
  }
};
