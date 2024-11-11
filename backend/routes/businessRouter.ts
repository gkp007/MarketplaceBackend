import express from "express";
import { businessCreate } from "../controller/businessController";
import { isAuthenticatedUser } from "../middleware/auth";
const router = express.Router();

router.route("/businessCreate/:id").post(businessCreate,isAuthenticatedUser);

export default router;
