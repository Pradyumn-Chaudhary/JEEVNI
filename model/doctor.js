import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String, required: true }, 
  qualifications: { type: String }, 
  experience: { type: Number }, 
  appointments: { type: [String] }, 
  history: { type: [String] }, 
  razorpayid: { type: String },
  razorpaysecret: { type: String },
}, { timestamps: true }); 

const doctor = models.doctor || model("doctor", UserSchema);
export default doctor;
