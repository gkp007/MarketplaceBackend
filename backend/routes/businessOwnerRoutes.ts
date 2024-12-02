import express from "express";
import {
  addOffer,
  createBusinessProfile,
  getAllInquiries,
} from "../controller/BusinessOwner/businessController";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth";
import { createOffer } from "../controller/BusinessOwner/offerController";

const router = express.Router();

router
  .route("/business-create/:user_id")
  .post(
    isAuthenticatedUser,
    authorizeRoles("BusinessOwner"),
    createBusinessProfile
  );

router
  .route("/create-offer")
  .post(isAuthenticatedUser, authorizeRoles("BusinessOwner"), createOffer);
//
router
  .route("/inquiries")
  .get(isAuthenticatedUser, authorizeRoles("BusinessOwner"), getAllInquiries);

//
router
  .route("/business/offer/:id")
  .patch(isAuthenticatedUser, authorizeRoles("BusinessOwner"), addOffer);

export default router;
