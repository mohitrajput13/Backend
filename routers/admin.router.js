import express from 'express';
import { body } from "express-validator";
import {  approveDoctorRequestAccept, approveDoctorRequestReject, getPendingDoctor, signIn, signUp } from "../controller/admin.controller.js";
const router=express.Router();
router.post("/sign-in", signIn);
router.post('/sign-up',
body('adminName', 'admin Name is Required').notEmpty(), 
body("password", "password is required").notEmpty(),
body("email", "email is required").notEmpty(),
body("email", "Invalid email id").isEmail(), 
body("contactNumber", "contact is required").notEmpty()
,signUp)
router.get('/get-pending-doctor',getPendingDoctor)
router.put('/approve-doctor-request-accept',approveDoctorRequestAccept);
router.put('/approve-doctor-request-reject',approveDoctorRequestReject);
export default router;