import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    adminName: {
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
export const AdminDetails=mongoose.model('adminDetail',adminSchema)