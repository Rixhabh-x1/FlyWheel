import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { nftAbi } from "../abis/nftABI.js";
import { stakingAbi } from "../abis/stakingABI.js";
import { marketplaceAbi } from "../abis/marketplaceABI.js";

const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.NFT,
  nftAbi,
  provider
);

const stakingContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Staking,
  stakingAbi,
  provider
);

const marketplaceContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Marketplace,
  marketplaceAbi,
  provider
);

export async function getStats() {
  const nextTokenId = await nftContract.nextTokenId();

  let existingNFTs = 0;
  let stakedNFTs = 0;
  let activeListings = 0;

  for (let tokenId = 0; tokenId < Number(nextTokenId); tokenId++) {
    try {
      await nftContract.ownerOf(tokenId);
      existingNFTs++;
    } catch {
    }

    const stakeInfo = await stakingContract.stakes(tokenId);

    if (stakeInfo.owner !== ethers.ZeroAddress) {
      stakedNFTs++;
    }

    const listing = await marketplaceContract.listings(tokenId);

    if (
      listing.seller !== ethers.ZeroAddress &&
      listing.price > 0n
    ) {
      activeListings++;
    }
  }

  return {
    totalMintedIds: Number(nextTokenId),
    existingNFTs,
    stakedNFTs,
    activeListings
  };
}