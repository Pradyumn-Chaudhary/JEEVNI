import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AppointmentSchema = new Schema({
  appointmentId: { type: String, required: true }, // Manually assigned unique ID
  doctorEmail: { type: String }, // User's email
  fees: { type: Number }, // Payment amount
  patientName: { type: String },
  doctorName: { type: String },
  problem: { type: String },
  paymentDone: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const HistorySchema = new Schema({
  doctorEmail: { type: String },
  doctorName: { type: String },
  problem: { type: String },
  date: { type: Date },
  fees: { type: Number },
});

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
    history: { type: [HistorySchema], default: [] },
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    category: { type: String },
    rating: { type: Number, default: 0 },
    isDoctor: { type: String, default: "none" },
    isApproved: { type: Boolean, default: false },
    about: { type: String },
    image: {type: String},
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
