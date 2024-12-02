import user from "../model/userModel";
import ErrorHandler from "../utils/errorHnadeler";
import catchAsyncError from "./catchAsyncError";
import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import 'dotenv/config'

interface DecodedData {
    id: string;
}

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const isAuthenticatedUser = catchAsyncError(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        const token = authHeader.replace(/^Bearer\s+/i, "");
        
        if (!token) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        try {
            const decodeData = JWT.verify(token, process.env.JWT_SECRET as string) as DecodedData;
            const User = await user.findById(decodeData.id);

            if (!User) {
                return next(new ErrorHandler("User not found", 404));
            }

            req.user = User;
            next();
        } catch (error) {
            return next(new ErrorHandler("Invalid or expired token", 401));
        }
    }
);

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role ${req.user?.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
