import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    profileImage:{
        type: String,
        trim: true
    }
},
{
    toJSON: { getters: true },
    versionKey: false 
});

export const Doctor = mongoose.model("doctor", doctorSchema);
const doctorDetailsSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    qualificationImage: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    },
    specialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AyurvedaCategory',
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    morningTimes: [{ type: String }], 
    afternoonTimes: [{ type: String }],
    eveningTimes: [{ type: String }] 
},
{
    toJSON: { getters: true },
    versionKey: false 
});

export const DoctorDetails = mongoose.model("doctorDetail", doctorDetailsSchema);