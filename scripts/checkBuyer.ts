import hre from "hardhat";

const { ethers } = await hre.network.create("robinhoodBuyer");

const [buyer] = await ethers.getSigners();

console.log("Buyer address:", buyer.address);