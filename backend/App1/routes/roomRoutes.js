import express from "express"
import { authenticateUser, authorizePermission } from "../middleware/authentication.js"
import { allRooms, roomDetail, createRoom,editRoom, changeStatus, getAllLocation } from "../controllers/roomController.js"

const router = express.Router()


router.post("/create", authenticateUser, authorizePermission("manager", "receptionist"), createRoom)
router.post("/edit/:roomId", authenticateUser, authorizePermission("manager"), editRoom)
router.post("/changeStatus/:roomId", authenticateUser, authorizePermission("manager"), changeStatus)
router.get("/getall", authenticateUser, authorizePermission("manager", "receptionist"), allRooms)
router.get("/:roomId", authenticateUser, roomDetail)
// Temporary to thi file
router.get("/branch/getall", authenticateUser, getAllLocation)


export default router
