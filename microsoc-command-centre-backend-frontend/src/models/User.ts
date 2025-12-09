// import { Schema, model, models } from "mongoose";

// const userSchema = new Schema({
//   username: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["admin", "analyst"],
//     default: "analyst",
//   },
// });

// const User = models.User || model("User", userSchema);
// export default User;

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'analyst';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isApproved:boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: [true, "Email field is required"], unique: true, lowercase: true ,trim:true}, // see it
    password: { type: String, required: true, minlength: 6 },//see this
    name: { type: String, required: [true, "Name field is required"] ,minLength: [2, "Name must be 2 character long."],},
    role: { type: String, enum: ['admin', 'analyst'], default: 'analyst' },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false }, //new line added
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };


// Next-JS run on edge ,hence it doesnt know that app is already running or not .
const UserModel = (mongoose.models.User as mongoose.Model<IUser>)|| mongoose.model<IUser>('User', userSchema);

export default UserModel;