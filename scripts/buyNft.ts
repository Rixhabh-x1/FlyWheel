import hre from "hardhat";

const { ethers } = await hre.network.create("robinhoodBuyer");

const TOKEN_ADDRESS = "0x70eb9cb955F68A1268319694E7B6446A65F40104";
const NFT_ADDRESS = "0xF99e9fbEC439851456b123daa40E28899c8DB979";
const MARKETPLACE_ADDRESS = "0x00283C3Ca716E1e8C0414c25d8721FfE9ADAbe06";

const [buyer] = await ethers.getSigners();

const token = await ethers.getContractAt("UpgToken", TOKEN_ADDRESS);
const nft = await ethers.getContractAt("FlywheelNFT", NFT_ADDRESS);
const marketplace = await ethers.getContractAt(
    "MarketplaceFW",
    MARKETPLACE_ADDRESS
);

console.log("Buyer:", buyer.address);

let tx = await token.approve(
    MARKETPLACE_ADDRESS,
    ethers.parseEther("10")
);

await tx.wait();
console.log("10 FWT approved");

tx = await marketplace.buyNFT(0);
await tx.wait();

console.log("NFT purchased successfully");

console.log("NFT #0 owner:", await nft.ownerOf(0));

const balance = await token.balanceOf(buyer.address);
console.log("Buyer FWT balance:", ethers.formatEther(balance));