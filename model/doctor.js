import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String }, 
  qualifications: { type: String }, 
  experience: { type: Number }, 
  appointments: { type: [{ type: Schema.Types.ObjectId, ref: "user" }] }, 
  history: { type: [{ type: Schema.Types.ObjectId, ref: "user" }] }, 
  razorpayid: { type: String },
  razorpaysecret: { type: String },
  approved: {type: Boolean, default: false}
}, { timestamps: true }); 

const Doctor = models.Doctor || model("Doctor", UserSchema);
export default Doctor;
