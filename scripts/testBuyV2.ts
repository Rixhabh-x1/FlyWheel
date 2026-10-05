import hre from "hardhat";

const { ethers } = await hre.network.create("robinhoodBuyer");

const TOKEN_ADDRESS = "0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519";
const NFT_ADDRESS = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3";
const MARKETPLACE_ADDRESS = "0xA2547D655dC4FFD3e1Cf9d749f07b4b7176c2FfD";

const tokenId = 3;
const price = ethers.parseEther("10");

const [buyer] = await ethers.getSigners();

const token = await ethers.getContractAt(
  "UpgTokenV2",
  TOKEN_ADDRESS
);

const nft = await ethers.getContractAt(
  "FlywheelNFTV2",
  NFT_ADDRESS
);

const marketplace = await ethers.getContractAt(
  "MarketplaceFWV2",
  MARKETPLACE_ADDRESS
);

console.log("Buyer:", buyer.address);
console.log("Marketplace Version:", await marketplace.version());

console.log(
  "Buyer FWT before:",
  ethers.formatEther(await token.balanceOf(buyer.address))
);

let tx = await token.approve(MARKETPLACE_ADDRESS, price);
await tx.wait();

console.log("10 FWT approved");

tx = await marketplace.buyNFT(tokenId);
await tx.wait();

console.log("NFT #3 purchased successfully");

console.log(
  "NFT #3 owner:",
  await nft.ownerOf(tokenId)
);

console.log(
  "Buyer FWT after:",
  ethers.formatEther(await token.balanceOf(buyer.address))
);

const listing = await marketplace.listings(tokenId);

console.log(
  "Listing price after purchase:",
  ethers.formatEther(listing.price)
);