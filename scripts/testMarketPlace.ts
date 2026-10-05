import hre from "hardhat";

const { ethers } = await hre.network.create();

const NFT_ADDRESS = "0xF99e9fbEC439851456b123daa40E28899c8DB979";
const MARKETPLACE_ADDRESS = "0x00283C3Ca716E1e8C0414c25d8721FfE9ADAbe06";

const nft = await ethers.getContractAt("FlywheelNFT", NFT_ADDRESS);
const marketplace = await ethers.getContractAt(
  "MarketplaceFW",
  MARKETPLACE_ADDRESS
);

const tokenId = 0;
const price = ethers.parseEther("10"); 
let tx = await nft.approve(MARKETPLACE_ADDRESS, tokenId);
await tx.wait();

console.log("Marketplace approved");

tx = await marketplace.listNFT(tokenId, price);
await tx.wait();

console.log("NFT listed successfully");
console.log("Token ID:", tokenId);
console.log("Price: 10 FWT");

const listing = await marketplace.listings(tokenId);

console.log("Seller:", listing.seller);
console.log("Listed price:", ethers.formatEther(listing.price));

console.log(
  "NFT currently held by:",
  await nft.ownerOf(tokenId)
);