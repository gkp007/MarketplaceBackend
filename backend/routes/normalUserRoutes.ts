import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import { addRating, getWatchlist, makeInquiry, toggleWatchlist, updateProfile } from "../controller/user/userController";
const router = express.Router();

router.route("/users/rating/:id").post(isAuthenticatedUser,addRating);
router.route("/users/inquiry/:id").post(isAuthenticatedUser,makeInquiry);

//watchList add get 
router.route("/watchlist/:businessID").post(isAuthenticatedUser, toggleWatchlist);
router.route("/get-watchlist/:id").get(isAuthenticatedUser, getWatchlist);

//update prole
router.route("/update-profile/:id").put(isAuthenticatedUser,updateProfile)
export default router;
