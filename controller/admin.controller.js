import { AdminDetails } from "../model/admin.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { Doctor, DoctorDetails } from "../model/doctor.model.js";
export const signIn = async (request, response) => {
  try {
    let { email, password } = request.body;
    let admin = await AdminDetails.findOne({ email });
    if (admin) {
      // if (bcrypt.compareSync(password, admin.password)) {
      if (password == admin.password) {
        admin = admin.toObject();
        delete admin.password;
        return response.status(200).json({ message: "Sign In success", admin });
      } else
        return response.status(401).json({ message: "Password Not Match" });
    }
    return response.status(401).json({ message: "Not Found" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
export const signUp = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response
        .status(400)
        .json({ error: "Bad request", errorMessage: errors.array() });

    let existingAdmin = await AdminDetails.findOne({
      email: request.body.email,
    });
    if (existingAdmin) {
      return response
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }

    let password = request.body.password;
    let saltKey = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, saltKey);
    request.body.password = password;

    let result = await AdminDetails.create(request.body);
    let admin = result.toObject();
    delete admin.password;

    return response
      .status(200)
      .json({ message: "Admin sign up success", admin });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error", error });
  }
};
export const getPendingDoctor = async (request, response) => {
  try {
    const pendingDoctorDetails = await DoctorDetails.find({ status: 0 });
    const doctorIds = pendingDoctorDetails.map((detail) => detail.doctor);
    const pendingDoctors = await Doctor.find({ _id: { $in: doctorIds } });
    const pendingDoctorInfo = pendingDoctors.map((doctor) => {
      const doctorDetail = pendingDoctorDetails.find(
        (detail) => detail.doctor.toString() === doctor._id.toString()
      );
      doctor.toObject();
      doctor.password = undefined;
      return {
        doctor,
        doctorDetails: doctorDetail,
      };
    });
    response.status(200).json({ pendingDoctorInfo });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
export const approveDoctorRequestAccept = async (request, response) => {
  try {
    const doctorId = request.body.doctorId;
    const updatedDoctorDetails = await DoctorDetails.findOneAndUpdate(
      { doctor: doctorId },
      { $set: { status: 1 } },
      { new: true }
    );
    if (!updatedDoctorDetails) {
      return response.status(404).json({ message: "Doctor details not found" });
    }
    return response.status(200).json({
      message: "Doctor request approved successfully",
      updatedDoctorDetails,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
export const approveDoctorRequestReject = async (request, response) => {
  try {
    const doctorId = request.body.doctorId;
    const updatedDoctorDetails = await DoctorDetails.findOneAndUpdate(
      { doctor: doctorId },
      { $set: { status: -1 } },
      { new: true }
    );
    if (!updatedDoctorDetails) {
      return response.status(404).json({ message: "Doctor details not found" });
    }
    return response.status(200).json({
      message: "Doctor request Reject successfully",
      updatedDoctorDetails,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
