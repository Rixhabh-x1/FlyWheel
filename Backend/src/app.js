import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { provider } from "./config/blockchain.js";
import tokenRoutes from "./routes/tokenRoutes.js"
import nftRoutes from "./routes/nftRoutes.js";
import stakingRoutes from "./routes/stakingRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "FLYChain backend is running"
  });
});

app.get("/api/network", async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    res.json({
      connected: true,
      chainId: network.chainId.toString(),
      blockNumber
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.use("/api/token", tokenRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/activity", activityRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});