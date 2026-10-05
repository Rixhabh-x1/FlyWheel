import { ethers } from "ethers";
import { provider } from "../config/blockchain.js";
import { CONTRACT_ADDRESSES } from "../config/contracts.js";
import { marketplaceAbi } from "../abis/marketplaceABI.js";
import { nftAbi } from "../abis/nftABI.js";
import { tokenAbi } from "../abis/tokenABI.js";

const marketplaceContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Marketplace,
  marketplaceAbi,
  provider
);

const nftContract = new ethers.Contract(
  CONTRACT_ADDRESSES.NFT,
  nftAbi,
  provider
);

const tokenContract = new ethers.Contract(
  CONTRACT_ADDRESSES.Token,
  tokenAbi,
  provider
);

export async function getActiveListings() {
  const nextTokenId = await nftContract.nextTokenId();
  const decimals = await tokenContract.decimals();

  const activeListings = [];

  for (let tokenId = 0; tokenId < Number(nextTokenId); tokenId++) {
    try {
      const listing = await marketplaceContract.listings(tokenId);

      const seller = listing.seller;
      const price = listing.price;

      if (
        seller !== ethers.ZeroAddress &&
        price > 0n
      ) {
        const rarity = await nftContract.rarity(tokenId);

        activeListings.push({
          tokenId: tokenId.toString(),
          seller,
          price: ethers.formatUnits(price, decimals),
          rarity: Number(rarity)
        });
      }
    } catch (error) {
    }
  }

  return activeListings;
}