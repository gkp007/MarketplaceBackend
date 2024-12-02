import express from "express";
import {
  getAllUsers,
  toggleUserBlock,
  verifyBusiness,
} from "../controller/admin/adminController";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

router.route("/admin/users").get(getAllUsers, isAuthenticatedUser);
router.route("/admin/users/block/:id").patch(toggleUserBlock, isAuthenticatedUser);
router
  .route("/admin/businesses/verify/:id")
  .patch(verifyBusiness, isAuthenticatedUser);

export default router;
