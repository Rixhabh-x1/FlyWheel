import hre from "hardhat";

const { ethers } = await hre.network.create();

const nft = await ethers.getContractAt(
  "FlywheelNFT",
  "0xF99e9fbEC439851456b123daa40E28899c8DB979"
);

const tx = await nft.mint({
  value: ethers.parseEther("0.001"),
});

await tx.wait();

console.log("NFT minted successfully!");
console.log("Transaction hash:", tx.hash);