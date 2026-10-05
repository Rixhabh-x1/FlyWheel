import express from "express";
import { getActiveListings } from "../services/marketplaceService.js";

const router = express.Router();

router.get("/listings", async (req, res) => {
  try {
    const listings = await getActiveListings();

    res.json({
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch marketplace listings",
      details: error.message
    });
  }
});

export default router;