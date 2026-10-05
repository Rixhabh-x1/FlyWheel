import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const NFT_ADDRESS = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3";
const MARKETPLACE_ADDRESS = "0xA2547D655dC4FFD3e1Cf9d749f07b4b7176c2FfD";

const nft = await ethers.getContractAt(
  "FlywheelNFTV2",
  NFT_ADDRESS
);

const marketplace = await ethers.getContractAt(
  "MarketplaceFWV2",
  MARKETPLACE_ADDRESS
);

const tokenId = 3;
const price = ethers.parseEther("10");

console.log("Marketplace Version:", await marketplace.version());
console.log("NFT owner before listing:", await nft.ownerOf(tokenId));

let tx = await nft.approve(MARKETPLACE_ADDRESS, tokenId);
await tx.wait();

console.log("Marketplace approved");

tx = await marketplace.listNFT(tokenId, price);
await tx.wait();

console.log("NFT #3 listed for 10 FWT");

console.log(
  "NFT owner after listing:",
  await nft.ownerOf(tokenId)
);

const listing = await marketplace.listings(tokenId);

console.log("Seller:", listing.seller);
console.log("Price:", ethers.formatEther(listing.price), "FWT");