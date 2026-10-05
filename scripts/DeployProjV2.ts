import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

const connection = await hre.network.create("robinhood");
const { ethers } = connection;

const upgradesApi = await upgrades(hre, connection);

const NFT_PROXY = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3";

const NFTV2 = await ethers.getContractFactory("FlywheelNFTV2");

const upgraded = await upgradesApi.upgradeProxy(
  NFT_PROXY,
  NFTV2
);

await upgraded.waitForDeployment();

console.log("NFT upgraded to V2");
console.log("Proxy address:", await upgraded.getAddress());
console.log("Version:", await upgraded.version());