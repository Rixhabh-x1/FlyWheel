import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const NFT_ADDRESS = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3";

const nft = await ethers.getContractAt(
  "FlywheelNFTV2",
  NFT_ADDRESS
);

console.log("NFT Version:", await nft.version());

let tx = await nft.mint({
  value: ethers.parseEther("0.001"),
});
await tx.wait();

console.log("NFT #1 minted");

tx = await nft.mint({
  value: ethers.parseEther("0.001"),
});
await tx.wait();

console.log("NFT #2 minted");

console.log("NFT #1 rarity:", await nft.rarity(1));
console.log("NFT #2 rarity:", await nft.rarity(2));

tx = await nft.fuse(1, 2);
await tx.wait();

console.log("NFT #1 + #2 fused");

console.log("New NFT #3 rarity:", await nft.rarity(3));
console.log("New NFT #3 owner:", await nft.ownerOf(3));