import express from "express";
import { sendOtp, verifyOtp } from "../controller/userController";
const router = express.Router();

router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp);

export default router;
