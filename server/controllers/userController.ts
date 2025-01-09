import { Request, Response } from "express";
import User from "../models/User";

// Get user by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, defaultMessage } = req.body;

  try {
    const user = new User({ userId, defaultMessage });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
