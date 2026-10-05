import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

const connection = await hre.network.create("robinhood");
const { ethers } = connection;

const upgradesApi = await upgrades(hre, connection);

const TOKEN_PROXY = "0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519";

const TokenV2 = await ethers.getContractFactory("UpgTokenV2");

const upgraded = await upgradesApi.upgradeProxy(
  TOKEN_PROXY,
  TokenV2
);

await upgraded.waitForDeployment();

console.log("Token upgraded to V2");
console.log("Proxy address:", await upgraded.getAddress());
console.log("Version:", await upgraded.version());
console.log("Owner:", await upgraded.owner());
console.log("Minter:", await upgraded.minter());