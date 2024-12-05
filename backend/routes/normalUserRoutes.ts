import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import { addRating, makeInquiry, updateProfile } from "../controller/user/userController";
const router = express.Router();

router.route("/users/rating/:id").post(isAuthenticatedUser,addRating);
router.route("/users/inquiry/:id").post(isAuthenticatedUser,makeInquiry);


//update prole
router.route("/update-profile/:id").put(isAuthenticatedUser,updateProfile)
export default router;
