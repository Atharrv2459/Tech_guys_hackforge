import express from "express";

import { verifyToken } from "../middleware/auth.js";
import { changePassword, getAllUsers, loginUser, registerUser } from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/getUsers", verifyToken, getAllUsers);
router.put("/change-password", verifyToken, changePassword);

export default router;
