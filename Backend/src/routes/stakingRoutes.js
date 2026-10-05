import express from "express";
import { ethers } from "ethers";
import { getStakedNFTs } from "../services/stakingService.js";

const router = express.Router();

router.get("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;

    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({
        error: "Invalid wallet address"
      });
    }

    const stakedNFTs = await getStakedNFTs(wallet);

    res.json({
      wallet,
      count: stakedNFTs.length,
      stakedNFTs
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch staking data",
      details: error.message
    });
  }
});

export default router;