"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buddyController_1 = require("../controllers/buddyController");
const router = express_1.default.Router();
// Routes
router.get("/", (req, res) => (0, buddyController_1.getBuddies)(req, res));
router.post("/", (req, res) => (0, buddyController_1.createBuddy)(req, res));
router.put("/:buddyId", (req, res) => (0, buddyController_1.updateBuddy)(req, res));
router.delete("/:buddyId", (req, res) => (0, buddyController_1.deleteBuddy)(req, res));
exports.default = router;
