import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "analyst"],
    default: "analyst",
  },
});

const User = models.User || model("User", userSchema);
export default User;