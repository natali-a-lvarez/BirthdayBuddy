import mongoose from "mongoose";

const BuddySchema = new mongoose.Schema({
  buddyId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  birthday: { type: Date, required: true },
  nickname: { type: String },
  customMessage: { type: String },
});

const Buddy = mongoose.model("Buddy", BuddySchema);
export default Buddy;
