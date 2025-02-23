"use server";
import connectDB from "@/db/connectDB";
import User from "@/model/user";

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
