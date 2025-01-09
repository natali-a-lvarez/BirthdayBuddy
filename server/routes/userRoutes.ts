import express, { Request, Response } from "express";
import { getUser, createUser } from "../controllers/userController";

const router = express.Router();

// Routes
router.get("/:userId", (req: Request, res: Response) => getUser(req, res));
router.post("/", (req: Request, res: Response) => createUser(req, res));

export default router;
