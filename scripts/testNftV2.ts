import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const NFT_PROXY = "0xF99e9fbEC439851456b123daa40E28899c8DB979";

const nft = await ethers.getContractAt(
  "FlywheelNFTV2",
  NFT_PROXY
);

console.log("Version:", await nft.version());

console.log("NFT #0 owner:", await nft.ownerOf(0));
console.log("NFT #0 rarity:", await nft.rarity(0));

console.log("NFT #3 owner:", await nft.ownerOf(3));
console.log("NFT #3 rarity:", await nft.rarity(3));