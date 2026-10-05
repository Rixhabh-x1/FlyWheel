import express from "express";
import { ethers } from "ethers";
import { getOwnedNFTs } from "../services/nftService.js";

const router = express.Router();

router.get("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;

    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({
        error: "Invalid wallet address"
      });
    }

    const nfts = await getOwnedNFTs(wallet);

    res.json({
      wallet,
      count: nfts.length,
      nfts
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch NFTs",
      details: error.message
    });
  }
});

export default router;