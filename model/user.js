import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AppointmentSchema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true }, // Manually assigned unique ID
    email: { type: String, required: true }, // User's email
    amount: { type: Number, required: true }, // Payment amount
  },
  { timestamps: true } // MongoDB will automatically generate `_id`
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String },
    phone: { type: String },
    qualifications: { type: String },
    experience: { type: Number },
    appointments: { type: [AppointmentSchema], default: [] }, // Array of appointment objects
    history: { type: [String] },
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    category: { type: String },
    rating: { type: Number },
    isDoctor: { type: String, default: "none" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
