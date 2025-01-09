"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BuddySchema = new mongoose_1.default.Schema({
    buddyId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    birthday: { type: Date, required: true },
    nickname: { type: String },
    customMessage: { type: String },
});
const Buddy = mongoose_1.default.model("Buddy", BuddySchema);
exports.default = Buddy;
