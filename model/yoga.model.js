import mongoose from "mongoose";

const yogaSchema = new mongoose.Schema({
    yogaName: {
        type: String,
        required: true,
        unique: true

    },
    Description: {
        type: String,
    },
    benefits: {
        type: Array,
    },
    instructions: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AyurvedaCategory'
    },
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReviewYoga",
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
}, { versionKey: false });

const Yoga = mongoose.model("Yoga", yogaSchema);

export default Yoga;
