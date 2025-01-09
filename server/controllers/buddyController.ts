import { Request, Response } from "express";
import Buddy from "../models/Buddy";

// Get all buddies for a user
export const getBuddies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  try {
    const buddies = await Buddy.find({ userId });
    res.status(200).json(buddies);
  } catch (error) {
    res.status(500).json({ error: "Failed to get buddies" });
  }
};

// Create a new buddy
export const createBuddy = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { buddyId, userId, name, birthday, nickname, customMessage } = req.body;

  try {
    const buddy = new Buddy({
      buddyId,
      userId,
      name,
      birthday,
      nickname,
      customMessage,
    });
    await buddy.save();
    res.status(201).json(buddy);
  } catch (error) {
    res.status(500).json({ error: "Failed to create buddy" });
  }
};

// Update a buddy
export const updateBuddy = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { buddyId } = req.params;
  const updateData = req.body;

  try {
    const buddy = await Buddy.findOneAndUpdate({ buddyId }, updateData, {
      new: true,
    });
    if (!buddy) {
      res.status(404).json({ error: "Buddy not found" });
      return;
    }
    res.status(200).json(buddy);
  } catch (error) {
    res.status(500).json({ error: "Failed to update buddy" });
  }
};

// Delete a buddy
export const deleteBuddy = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { buddyId } = req.params;

  try {
    const buddy = await Buddy.findOneAndDelete({ buddyId });
    if (!buddy) {
      res.status(404).json({ error: "Buddy not found" });
      return;
    }
    res.status(200).json({ message: "Buddy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete buddy" });
  }
};
