import express from "express";
import {
  sendOtp,
  verifyOtp,
  sendEmailOtp,
  emailVerify,
} from "../controller/userController";
const router = express.Router();

router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp);
router.route("/sendEmailOtp").post(sendEmailOtp);
router.route("/verifyEmailOtp").post(emailVerify);

export default router;
