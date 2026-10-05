import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

const connection = await hre.network.create("robinhood");
const { ethers } = connection;

const upgradesApi = await upgrades(hre, connection);

const STAKING_PROXY = "0x4c9bfBAa9A39ea0f5ebf8ad5D796eFCA06Ee66D7";

const StakingV2 = await ethers.getContractFactory("StakingFWV2");

const upgraded = await upgradesApi.upgradeProxy(
  STAKING_PROXY,
  StakingV2
);

await upgraded.waitForDeployment();

console.log("Staking upgraded to V2");
console.log("Proxy address:", await upgraded.getAddress());
console.log("Version:", await upgraded.version());