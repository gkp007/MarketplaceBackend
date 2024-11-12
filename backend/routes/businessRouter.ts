import express from "express";
import { businessCreate, getBusiness } from "../controller/businessController";
import { isAuthenticatedUser } from "../middleware/auth";
const router = express.Router();

router.route("/businessCreate/:id").post(businessCreate, isAuthenticatedUser);
router
  .route(`/getBusiness`)
  .get(getBusiness, isAuthenticatedUser);

export default router;
