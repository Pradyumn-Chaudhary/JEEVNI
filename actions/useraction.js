"use server";
import connectDB from "@/db/connectDB";
import User from "@/model/user";
import { v4 as uuidv4 } from "uuid";

export const fetchuser = async (email) => {
  await connectDB();
  let u = await User.findOne({ email: email });
  let user = u.toObject({ flattenObjectIds: true });
  return user;
};

export const updateProfile = async (data, email) => {
  await connectDB();
  let ndata = Object.fromEntries(data);
  await User.updateOne({ email: ndata.email }, ndata);
};

export const fetchDoctor = async (prefix) => {
  await connectDB();
  const users = await User.find({
    isDoctor: "doctor",
    isApproved: true,
    $or: [
      { name: { $regex: `^${prefix}`, $options: "i" } },
      { category: { $regex: `^${prefix}`, $options: "i" } },
    ],
  })
    .select("name category qualifications experience rating")
    .sort({ rating: -1 })
    .limit(7)
    .lean();

  return users;
};

const addAppointment = async (doctorEmail, patientEmail, amount) => {
  const id = uuidv4();

  const doctor = await User.findOne({ email: doctorEmail });

  if (!doctor) {
    console.log("Doctor not found");
    return;
  }

  doctor.appointments.push({
    appointmentId: id,
    email: patientEmail,
    amount: amount,
  });

  await doctor.save();

  const user = await User.findOne({ email: patientEmail });

  if (!user) {
    console.log("user not found");
    return;
  }

  user.appointments.push({
    appointmentId: id,
    email: doctorEmail,
    amount: amount,
  });

  await user.save();

  console.log("Appointment added successfully");
};
