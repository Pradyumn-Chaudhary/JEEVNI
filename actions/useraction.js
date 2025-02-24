"use server";
import connectDB from "@/db/connectDB";
import User from "@/model/user";
import { v4 as uuidv4 } from "uuid";

export const updateProfile = async (data, email) => {
  await connectDB();
  try {
    const updateData = { ...data }; // Clone data
    console.log("Data to update:", updateData); // Debug: Check what’s being sent
    console.log("Email for query:", email); // Debug: Verify email

    const result = await User.updateOne({ email }, { $set: updateData }); // Use $set for explicit updates
    console.log("Update result:", result); // Debug: Check MongoDB response

    if (result.modifiedCount === 0) {
      throw new Error("No documents were updated. Either the user wasn’t found or no changes were made.");
    }

    return { success: true, result }; // Return a meaningful response
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error; // Re-throw to be caught in handleSubmit
  }
};

export const fetchuser = async (email) => {
  await connectDB();
  try {
    const user = await User.findOne({ email }).lean(); // .lean() for plain JS object
    console.log("Fetched user:", user); // Debug: Check what’s returned
    return user || {};
  } catch (error) {
    console.error("Error fetching user:", error);
    return {};
  }
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
