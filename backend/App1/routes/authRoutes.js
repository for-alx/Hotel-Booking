import express from "express"
import { signUp, verify, signIn, logout, forgetPassword, resetPassword, createUser, me } from "../controllers/authController.js"
import { authenticateUser, authorizePermission } from "../middleware/authentication.js"
import { refresh } from "../middleware/authentication.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/verify", verify)
router.post("/signin", signIn)
router.get("/refresh", refresh)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)
router.post("/logout", authenticateUser, logout)
// Must move to it's own route file
router.post("/createUser", authenticateUser, authorizePermission("manager", "receptionist"), createUser)
router.get("/me", authenticateUser, me)

export default router
