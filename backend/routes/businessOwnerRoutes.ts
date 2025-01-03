import express from "express";
import {
  addOffer,
  createBusinessProfile,
  getAllInquiries,
  getBusinessProfile,
} from "../controller/BusinessOwner/businessController";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth";
import { createOffer, getOffer } from "../controller/BusinessOwner/offerController";
import { enquiryGet, enquiryPost } from "../controller/user/userController";

const router = express.Router();

router
  .route("/business-create/:user_id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("BusinessOwner"),
    createBusinessProfile
  );

router
  .route("/business-get/:user_id")
  .get(
    isAuthenticatedUser,
    authorizeRoles("BusinessOwner"),
    getBusinessProfile
  );

router
  .route("/create-offer")
  .post(isAuthenticatedUser, authorizeRoles("BusinessOwner"), createOffer);

router
  .route("/get-offers/:id")
  .get(getOffer)

  //
router
  .route("/inquiries")
  .get(isAuthenticatedUser, authorizeRoles("BusinessOwner"), getAllInquiries);

//
router
  .route("/business/offer/:id")
  .patch(isAuthenticatedUser, authorizeRoles("BusinessOwner"), addOffer);


//inquiry
router.route("/enquiry-create/:businessID").post(isAuthenticatedUser,authorizeRoles("BusinessOwner"),enquiryPost)
router.route("/enquiry-get/:userID").get(isAuthenticatedUser,authorizeRoles("BusinessOwner"),enquiryGet)
export default router;
