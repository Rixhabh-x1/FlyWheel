import express from "express";
import { getStats } from "../services/statsService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stats = await getStats();

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch stats",
      details: error.message
    });
  }
});

export default router;