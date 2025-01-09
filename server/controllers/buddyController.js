"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBuddy = exports.updateBuddy = exports.createBuddy = exports.getBuddies = void 0;
const Buddy_1 = __importDefault(require("../models/Buddy"));
// Get all buddies for a user
const getBuddies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const buddies = yield Buddy_1.default.find({ userId });
        res.status(200).json(buddies);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get buddies" });
    }
});
exports.getBuddies = getBuddies;
// Create a new buddy
const createBuddy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buddyId, userId, name, birthday, nickname, customMessage } = req.body;
    try {
        const buddy = new Buddy_1.default({
            buddyId,
            userId,
            name,
            birthday,
            nickname,
            customMessage,
        });
        yield buddy.save();
        res.status(201).json(buddy);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create buddy" });
    }
});
exports.createBuddy = createBuddy;
// Update a buddy
const updateBuddy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buddyId } = req.params;
    const updateData = req.body;
    try {
        const buddy = yield Buddy_1.default.findOneAndUpdate({ buddyId }, updateData, {
            new: true,
        });
        if (!buddy) {
            res.status(404).json({ error: "Buddy not found" });
            return;
        }
        res.status(200).json(buddy);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update buddy" });
    }
});
exports.updateBuddy = updateBuddy;
// Delete a buddy
const deleteBuddy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buddyId } = req.params;
    try {
        const buddy = yield Buddy_1.default.findOneAndDelete({ buddyId });
        if (!buddy) {
            res.status(404).json({ error: "Buddy not found" });
            return;
        }
        res.status(200).json({ message: "Buddy deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete buddy" });
    }
});
exports.deleteBuddy = deleteBuddy;
