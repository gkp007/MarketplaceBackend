import express from "express";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth";
import { sendOtp, verifyOtp } from "../controller/userController";
const router = express.Router();

export const userRoutes = () => {
  router.route("/sendOtp").post(sendOtp);
  router.route("/verifyOtp").post(verifyOtp);

};
