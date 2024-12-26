import express from "express";
import {
  forgotPassword,
  getUserById,
  getUserByEmail,
  deleteUser,
  getProfile,
  signIn,
  signUp,
  updateProfile,
} from "../controller/user.controller.js";
import { body } from "express-validator";
import multer from "multer";
const upload = multer({ dest: "public/images/" });
const router = express.Router();

router.post(
  "/signup",
  body("username", "username is required").notEmpty(),
  body("password", "password is required").notEmpty(),
  body("email", "email is required").notEmpty(),
  body("contact", "contact is required").notEmpty(),
  signUp
);

router.post("/signin", signIn);
router.post("/update-profile", upload.single("profile"), updateProfile);
router.post("/forgot-password", body("email").isEmail(), forgotPassword);
router.get("/profile/:userId", getProfile);
router.get("/data/:userId", getUserById);
router.get("/email/:email", getUserByEmail);
router.delete("/user/:identifier", deleteUser);

export default router;
