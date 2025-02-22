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