import express, { Request, Response } from "express";
import {
  getBuddies,
  createBuddy,
  updateBuddy,
  deleteBuddy,
} from "../controllers/buddyController";

const router = express.Router();

// Routes
router.get("/", (req: Request, res: Response) => getBuddies(req, res));
router.post("/", (req: Request, res: Response) => createBuddy(req, res));
router.put("/:buddyId", (req: Request, res: Response) => updateBuddy(req, res));
router.delete("/:buddyId", (req: Request, res: Response) =>
  deleteBuddy(req, res)
);

export default router;
