import mongoose,{ model } from "mongoose";
const AyurvedaCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})
export const AyurvedaCategory = mongoose.model('AyurvedaCategory', AyurvedaCategorySchema);