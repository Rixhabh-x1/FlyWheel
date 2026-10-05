import express from "express";
import { ethers } from "ethers";
import { getWalletActivity } from "../services/activityService.js";

const router = express.Router();

router.get("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;

    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({
        error: "Invalid wallet address"
      });
    }

    const activity = await getWalletActivity(wallet);

    res.json({
      wallet,
      count: activity.length,
      activity
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch wallet activity",
      details: error.message
    });
  }
});

export default router;