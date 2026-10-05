import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const NFT_ADDRESS = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3";
const STAKING_ADDRESS = "0x4c9bfBAa9A39ea0f5ebf8ad5D796eFCA06Ee66D7";
const TOKEN_ADDRESS = "0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519";

const nft = await ethers.getContractAt("FlywheelNFTV2", NFT_ADDRESS);
const staking = await ethers.getContractAt("StakingFWV2", STAKING_ADDRESS);
const token = await ethers.getContractAt("UpgTokenV2", TOKEN_ADDRESS);

const tokenId = 0;

console.log("Staking Version:", await staking.version());
console.log("Token Version:", await token.version());

console.log("NFT owner:", await nft.ownerOf(tokenId));

let tx = await nft.approve(STAKING_ADDRESS, tokenId);
await tx.wait();
console.log("Staking approved");

tx = await staking.stake(tokenId);
await tx.wait();
console.log("NFT staked");

console.log("Waiting 10 seconds...");
await new Promise((resolve) => setTimeout(resolve, 10000));

tx = await staking.unstake(tokenId);
await tx.wait();
console.log("NFT unstaked");

console.log("NFT owner after unstake:", await nft.ownerOf(tokenId));

const balance = await token.balanceOf(
  (await ethers.getSigners())[0].address
);

console.log("FWT balance:", ethers.formatEther(balance));