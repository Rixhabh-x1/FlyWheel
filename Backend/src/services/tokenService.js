import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { tokenAbi } from "../abis/tokenABI.js";

const tokenContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Token,
  tokenAbi,
  provider
);

export async function getTokenBalance(wallet) {
  const balance = await tokenContract.balanceOf(wallet);
  const decimals = await tokenContract.decimals();
  const symbol = await tokenContract.symbol();

  return {
    balance: ethers.formatUnits(balance, decimals),
    symbol
  };
}