import mongoose from "mongoose";
const { Schema, model, models } = mongoose;


const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String}, 
  appointments: { type: [{ type: Schema.Types.ObjectId, ref: "doctor" }] }, 
  history: { type:[{ type: Schema.Types.ObjectId, ref: "doctor" }] }, 
}, { timestamps: true }); 

const User = models.User || model("User", UserSchema);
export default User;
