import mongoose from "mongoose";
const { Schema, model, models } = mongoose;


const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String }, 
  qualifications: { type: String }, 
  experience: { type: Number }, 
  appointments: { type: [String] }, 
  history: { type: [String] }, 
  razorpayid: { type: String },
  razorpaysecret: { type: String },
  isDoctor: { type: String, default: "none" },
  approved: {type: Boolean, default: false}
}, { timestamps: true }); 

const User = models.User || model("User", UserSchema);
export default User;
