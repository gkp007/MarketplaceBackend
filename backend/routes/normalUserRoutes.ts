import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import { addRating, makeInquiry } from "../controller/user/userController";
const router = express.Router();

router.route("/users/rating/:id").post(addRating, isAuthenticatedUser);
router.route("/users/inquiry/:id").post(makeInquiry, isAuthenticatedUser);

export default router;
