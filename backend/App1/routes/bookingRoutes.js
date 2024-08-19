import express from "express"
import { authenticateUser, authorizePermission } from "../middleware/authentication.js"
import { createBooking, bookingHistory, checkAvailability, getLatestBookings, getBookingInfo } from "../controllers/bookingController.js"

const router = express.Router()

router.post("/create/:roomId", authenticateUser, createBooking)
router.post("/checkAvailability", checkAvailability)
router.get("/history", authenticateUser, bookingHistory )
router.get("/latestBookings", authenticateUser, authorizePermission("manager", "receptionist"), getLatestBookings )
router.get("/bookingInfo/:bookingId", authenticateUser, getBookingInfo)


export default router
