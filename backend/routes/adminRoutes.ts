import express from "express";
import {
  getAllUsers,
  toggleUserBlock,
  verifyBusiness,
  VerifyBusinessShop
} from "../controller/admin/adminController";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

router.route("/admin/users").get(getAllUsers, isAuthenticatedUser);
router.route("/admin/users/block/:id").patch(toggleUserBlock, isAuthenticatedUser);
router
  .route("/admin/businesses/verify/:id")
  .put(isAuthenticatedUser,verifyBusiness );

//ongoing
router
  .route("/admin/businesses/shop/:id")
  .patch(VerifyBusinessShop,isAuthenticatedUser );

export default router;
