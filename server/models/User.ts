import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  defaultMessage: {
    type: String,
    default:
      "🎉 Happy Birthday! 🎂 Wishing you a fantastic day filled with love, laughter, and all your favorite things. Have an amazing year ahead! 🥳",
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
