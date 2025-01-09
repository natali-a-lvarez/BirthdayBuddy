"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: true },
    defaultMessage: {
        type: String,
        default: "🎉 Happy Birthday! 🎂 Wishing you a fantastic day filled with love, laughter, and all your favorite things. Have an amazing year ahead! 🥳",
    },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
