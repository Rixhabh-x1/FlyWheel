import "dotenv/config";
import { ethers } from "ethers";

const RPC_URL = process.env.ROBINHOOD_RPC_URL;

if (!RPC_URL) {
  throw new Error("ROBINHOOD_RPC_URL is missing in .env");
}

export const provider = new ethers.JsonRpcProvider(RPC_URL);