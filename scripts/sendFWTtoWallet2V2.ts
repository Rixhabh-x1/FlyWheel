import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const TOKEN_ADDRESS = "0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519";

const BUYER_ADDRESS = "0x7A46F9ADE1B741640dB0BA9cb932D655B5081c0c";

const token = await ethers.getContractAt(
  "UpgTokenV2",
  TOKEN_ADDRESS
);

const tx = await token.transfer(
  BUYER_ADDRESS,
  ethers.parseEther("8000")
);

await tx.wait();

console.log("8000 FWT sent to Wallet 2");

console.log(
  "Wallet 2 FWT:",
  ethers.formatEther(await token.balanceOf(BUYER_ADDRESS))
);