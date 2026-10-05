import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

const connection = await hre.network.create("robinhood");
const { ethers } = connection;

const upgradesApi = await upgrades(hre, connection);

const MARKETPLACE_PROXY = "0xA2547D655dC4FFD3e1Cf9d749f07b4b7176c2FfD";

const MarketplaceV2 =
  await ethers.getContractFactory("MarketplaceFWV2");

const upgraded = await upgradesApi.upgradeProxy(
  MARKETPLACE_PROXY,
  MarketplaceV2
);

await upgraded.waitForDeployment();

console.log("Marketplace upgraded to V2");
console.log("Proxy address:", await upgraded.getAddress());
console.log("Version:", await upgraded.version());