import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { stakingAbi } from "../abis/stakingABI.js";
import { nftAbi } from "../abis/nftABI.js";

const stakingContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Staking,
  stakingAbi,
  provider
);

const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.NFT,
  nftAbi,
  provider
);

export async function getStakedNFTs(wallet) {
  const nextTokenId = await nftContract.nextTokenId();
  const rewardRate = await stakingContract.rewardRate();

  const stakedNFTs = [];

  const now = Math.floor(Date.now() / 1000);

  for (let tokenId = 0; tokenId < Number(nextTokenId); tokenId++) {
    try {
      const stakeInfo = await stakingContract.stakes(tokenId);

      const staker = stakeInfo.owner;
      const stakedAt = Number(stakeInfo.stakedAt);

      if (
        staker.toLowerCase() === wallet.toLowerCase() &&
        stakedAt > 0
      ) {
        const duration = now - stakedAt;

        const estimatedReward =
          BigInt(duration) * rewardRate;

        const rarity = await nftContract.rarity(tokenId);

        stakedNFTs.push({
          tokenId: tokenId.toString(),
          rarity: Number(rarity),
          stakedAt,
          duration,
          estimatedReward: ethers.formatUnits(
            estimatedReward,
            18
          )
        });
      }
    } catch (error) {
    }
  }

  return stakedNFTs;
}