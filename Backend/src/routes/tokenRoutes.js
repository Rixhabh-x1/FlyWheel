import express from "express";
import { ethers } from "ethers";
import { getTokenBalance } from "../services/tokenService.js";

const router = express.Router();

router.get("/balance/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;

    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({
        error: "Invalid wallet address"
      });
    }

    const data = await getTokenBalance(wallet);

    res.json({
      wallet,
      ...data
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch FWT balance",
      details: error.message
    });
  }
});

export default router;