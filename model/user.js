import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String, required: true }, 
  appointments: { type: [String] }, 
  history: { type: [String] }, 
}, { timestamps: true }); 

const user = models.user || model("user", UserSchema);
export default user;
