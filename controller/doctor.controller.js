import { Doctor, DoctorDetails } from "../model/doctor.model.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
export const signUp = async (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return response.status(401).json({ error: "Bad request", errorMessage: errors.array() });
        let existingDoctor = await Doctor.findOne({ email: request.body.email });
        let contactDoctor = await Doctor.findOne({ contactNumber: request.body.contactNumber });
        if (existingDoctor) {
            return response.status(400).json({ error: "Doctor with this email already exists" });
        }
        if (contactDoctor) {
            return response.status(400).json({ error: "Doctor with this Contact already exists" });
        }
        let password = request.body.password;
        let saltKey = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, saltKey);
        request.body.password = password;
        let result = await Doctor.create(request.body);
        request = result.toObject();
        return response.status(200).json({ message: "Sign up success", doctor: result });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Internal Server Error", error });
    }

}
export const signIn = async (request, response, next) => {
    try {
        let { email, password } = request.body;
        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            if (bcrypt.compareSync(password, doctor.password)) {
                doctor = doctor.toObject();
                delete doctor.password;
                return response.status(200).json({ message: "Sign In success", doctor: doctor, token: generateToken(email) });
            }
            else
                return response.status(401).json({ message: "Password Not Match" });
        }
        return response.status(401).json({ message: "Doctor Not Found" });
    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" });
    }
}
export const doctorList = (request, response, next) => {
    Doctor.find()
        .then(result => {
            return response.status(200).json({ doctor: result });
        }).catch(err => {
            return response.status(500).json({ error: "Internal server error" });
        })
}

export const updateProfile = async (request, response, next) => {
    try {
        const updateFields = request.body;
        const doctorId = request.params.doctorId;

        let doctor = await Doctor.findOne(doctorId);

        if (!doctor) {
            return response.status(404).json({ message: "Doctor not found" });
        }
        doctor.set(updateFields);
        await doctor.save();
        delete updateFields.doctorId;
        updateFields._id=doctorId;
        return response.status(200).json({ message: "Doctor profile updated successfully", doctor });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const changePassword = async (request, response, next) => {
    try {
        let { doctorId, oldPassword, newPassword } = request.body;
        let doctor = await Doctor.findOne({ _id: doctorId });
        if (!doctor)
            return response.status(404).json({ message: "Doctor Id not available" });

        if (!bcrypt.compareSync(oldPassword, doctor.password)) {
            return response.status(400).json({ message: "Old password is incorrect" });
        }

        let saltKey = bcrypt.genSaltSync(10);
        newPassword = bcrypt.hashSync(newPassword, saltKey);
        doctor.password = newPassword;

        await doctor.save();

        return response.status(200).json({ message: "Password Changed" });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
}


export const removeDoctor = async (request, response, next) => {
    try {
        let doctorId = request.body.doctorId;
        let doctor = await Doctor.deleteOne({ _id: doctorId });
        return doctor.deletedCount ? response.status(200).json({ message: "Doctor deleted successfully" }) : response.status(404).json({ message: "Doctor not found" });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const addDoctorDetails = async (request, response, next) => {
    try {
        const { doctorId, experience, gender, language, clinicAddress, specialization } = request.body;

        if (!doctorId) {
            return response.status(400).json({ error: 'Doctor ID is required' });
        }

        const existingDoctor = await Doctor.findById(doctorId);
        if (!existingDoctor) {
            return response.status(404).json({ error: 'Doctor not found' });
        }

        // Extract time slots from request body
        const { morningTimes, afternoonTimes, eveningTimes } = request.body;

        // Create doctorDetails object
        const doctorDetails = new DoctorDetails({
            doctor: doctorId,
            qualificationImage: request.file.filename,
            experience,
            gender,
            language,
            clinicAddress,
            specialization,
            status: 0,
            morningTimes,
            afternoonTimes,
            eveningTimes
        });

        await doctorDetails.save();

        response.status(201).json({ message: 'Doctor details added successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const addImage = async (request, response) => {
    try {
        const doctorId = request.body.doctorId;
        const file = request.file;
        console.log(doctorId);
        if (!doctorId) {
            return response.status(400).json({ error: 'Doctor ID is required' });
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return response.status(404).json({ error: 'Doctor not found' });
        }
        doctor.profileImage = file.filename; // Only save the filename without the directory path
        await doctor.save();

        response.status(200).json({ message: 'Profile picture uploaded successfully', filePath: file.filename });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getDoctorDetails = async (request, response) => {
    try {
        const doctorId = request.body.doctorId;
        const doctorDetail = await DoctorDetails.findOne({ doctor: doctorId });

        if (!doctorDetail) {
            return response.status(404).json({ message: "Doctor details not found" });
        }

        return response.status(200).json({ doctorDetail });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getActiveDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 1 });
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const generateToken = (email) => {
    let payload = { subject: email };
    return jwt.sign(payload, "klsnd8asdkasldmr9374rasd98")
}