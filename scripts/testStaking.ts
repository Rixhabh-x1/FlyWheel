import hre from "hardhat";

const { ethers } = await hre.network.create();
const [user] = await ethers.getSigners();

const NFT_ADDRESS = "0xF99e9fbEC439851456b123daa40E28899c8DB979";
const STAKING_ADDRESS = "0x086e127850B3cC511F8F69A370e962Cd72a6D580";
const TOKEN_ADDRESS = "0x70eb9cb955F68A1268319694E7B6446A65F40104";

const nft = await ethers.getContractAt("FlywheelNFT", NFT_ADDRESS);
const staking = await ethers.getContractAt("StakingFW", STAKING_ADDRESS);
const token = await ethers.getContractAt("UpgToken", TOKEN_ADDRESS);

const tokenId = 0;

console.log("NFT owner:", await nft.ownerOf(tokenId));

let tx = await nft.approve(STAKING_ADDRESS, tokenId);
await tx.wait();
console.log("Staking approved");

tx = await staking.stake(tokenId);
await tx.wait();
console.log("NFT staked");

console.log("Waiting 10 seconds...");
await new Promise(resolve => setTimeout(resolve, 10000));

tx = await staking.unstake(tokenId);
await tx.wait();
console.log("NFT unstaked");

console.log("NFT owner after unstake:", await nft.ownerOf(tokenId));

const balance = await token.balanceOf(user.address);
console.log("FWT balance:", ethers.formatEther(balance));