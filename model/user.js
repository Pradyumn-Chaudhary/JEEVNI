import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AppointmentSchema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true }, // Manually assigned unique ID
    email: { type: String, required: true }, // User's email
    amount: { type: Number, required: true }, // Payment amount
    patientName: { type: String, require: true },
    doctorName: { type: String, require: true },
    problem: { type: String },
  },
  { timestamps: true } // MongoDB will automatically generate `_id`
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String },
    username: { type: String },
    location: { type: String },
    phone: { type: String },
    gender: { type: String },
    qualification: { type: String },
    experience: { type: Number },
    fees: { type: Number },
    appointments: { type: [AppointmentSchema], default: [] }, // Array of appointment objects
    history: { type: [String], default: [] },
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    category: { type: String },
    rating: { type: Number, default: 0 },
    isDoctor: { type: String, default: "none" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
