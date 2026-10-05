import hre from "hardhat";

const { ethers } = await hre.network.create();

const TOKEN_ADDRESS = "0x70eb9cb955F68A1268319694E7B6446A65F40104";
const WALLET_2 = "0x7A46F9ADE1B741640dB0BA9cb932D655B5081c0c";

const token = await ethers.getContractAt("UpgToken", TOKEN_ADDRESS);

const tx = await token.transfer(
  WALLET_2,
  ethers.parseEther("20")
);

await tx.wait();

console.log("20 FWT sent to Wallet 2");
console.log("Transaction:", tx.hash);

const balance = await token.balanceOf(WALLET_2);
console.log("Wallet 2 FWT:", ethers.formatEther(balance));