import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { addDoctorDetails, addImage, changePassword, doctorList, getActiveDoctors, getDoctorDetails, removeDoctor, signIn, signUp, updateProfile } from "../controller/doctor.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
router.post("/sign-up", 
    body('doctorName', 'doctor Name is Required').notEmpty(), 
    body("password", "password is required").notEmpty(),
    body("email", "email is required").notEmpty(),
    body("email", "Invalid email id").isEmail(), 
    body("contactNumber", "contact is required").notEmpty(),
    signUp
);
router.post("/sign-in", signIn);
router.get("/doctor-list", doctorList);
router.post("/update-profile", updateProfile);
router.post("/change-password", changePassword);
router.delete("/remove-doctor", removeDoctor);
router.post("/add-doctor-details", upload.single("qualificationImage"), addDoctorDetails);
router.post('/add-profile-picture', upload.single("profile"), addImage);
router.post('/get-doctor-details',getDoctorDetails);
router.get('/active', getActiveDoctors);
export default router;
