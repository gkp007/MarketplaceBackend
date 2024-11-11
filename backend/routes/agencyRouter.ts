import express from "express";
import { sendagencyMessage } from "../controller/agencyController";
import { isAuthenticatedUser } from "../middleware/auth";
const router = express.Router();

router.route("/sendAgencyMessage/:id").post(sendagencyMessage,isAuthenticatedUser);

export default router;
