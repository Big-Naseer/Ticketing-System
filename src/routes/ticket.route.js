import express from "express";
import { createTicket, getTicket, getMyTickets, checkIn, checkOut } from "../controller/ticket.controller.js";
import {scanLimiter} from "../middleware/ratelimiter.js"
import { authenticate } from "../middleware/admin.auth.js";

const router = express.Router();

router.post("/create", authenticate, createTicket);
router.get("/:code", authenticate, getTicket);
router.post("/checkin", scanLimiter, checkIn);
router.post("/checkout", checkOut);
router.get("/", authenticate, getMyTickets)

export default router;
