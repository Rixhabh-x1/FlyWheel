import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { nftAbi } from "../abis/nftABI.js";

const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.NFT,
  nftAbi,
  provider
);

export async function getOwnedNFTs(wallet) {
  const nextTokenId = await nftContract.nextTokenId();

  const ownedNFTs = [];

  for (let tokenId = 0; tokenId < Number(nextTokenId); tokenId++) {
    try {
      const owner = await nftContract.ownerOf(tokenId);

      if (owner.toLowerCase() === wallet.toLowerCase()) {
        const rarity = await nftContract.rarity(tokenId);

        ownedNFTs.push({
          tokenId: tokenId.toString(),
          rarity: Number(rarity)
        });
      }
    } catch (error) {
   }
  }

  return ownedNFTs;
}