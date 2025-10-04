import express from "express";
import { registerAdmin, loginAdmin } from "../controller/auth.controller.js";
import {authLimiter} from "../middleware/ratelimiter.js"
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login",authLimiter, loginAdmin);

export default router;