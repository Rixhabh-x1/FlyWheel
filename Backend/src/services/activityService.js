import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { nftAbi } from "../abis/nftABI.js";

const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.NFT,
  nftAbi,
  provider
);

export async function getWalletActivity(wallet) {
  const incomingFilter = nftContract.filters.Transfer(null, wallet, null);
  const outgoingFilter = nftContract.filters.Transfer(wallet, null, null);

  const latestBlock = await provider.getBlockNumber();
const fromBlock = Math.max(0, latestBlock - 9_000_000);

const incomingEvents = await nftContract.queryFilter(
  incomingFilter,
  fromBlock,
  latestBlock
);

const outgoingEvents = await nftContract.queryFilter(
  outgoingFilter,
  fromBlock,
  latestBlock
);

  const events = [...incomingEvents, ...outgoingEvents];

  const uniqueEvents = new Map();

  for (const event of events) {
    const key = `${event.transactionHash}-${event.index}`;
    uniqueEvents.set(key, event);
  }

  const activity = [];

  for (const event of uniqueEvents.values()) {
    const { from, to, tokenId } = event.args;

    let type = "TRANSFER";

    if (from === ethers.ZeroAddress) {
      type = "MINT";
    } else if (to === ethers.ZeroAddress) {
      type = "BURN";
    } else if (
      to.toLowerCase() === CONTRACT_ADDRESSES.Staking.toLowerCase()
    ) {
      type = "STAKE";
    } else if (
      from.toLowerCase() === CONTRACT_ADDRESSES.Staking.toLowerCase()
    ) {
      type = "UNSTAKE";
    } else if (
      to.toLowerCase() === CONTRACT_ADDRESSES.Marketplace.toLowerCase()
    ) {
      type = "LIST";
    } else if (
      from.toLowerCase() === CONTRACT_ADDRESSES.Marketplace.toLowerCase()
    ) {
      type = "MARKETPLACE_OUT";
    }

    activity.push({
      type,
      tokenId: tokenId.toString(),
      from,
      to,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  }

  return activity.sort(
    (a, b) => b.blockNumber - a.blockNumber
  );
}