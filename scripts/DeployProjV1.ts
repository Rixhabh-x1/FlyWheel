import hre from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;
  const upgradesApi = await upgrades(hre, connection);

  const [deployer] = await ethers.getSigners();

  console.log("Deploying from:", deployer.address);

  const Token = await ethers.getContractFactory("UpgToken");

  const token = await upgradesApi.deployProxy(
    Token,
    [deployer.address],
    { kind: "uups" }
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("Token:", tokenAddress);


  const NFT = await ethers.getContractFactory("FlywheelNFT");

  const nft = await upgradesApi.deployProxy(
    NFT,
    [deployer.address],
    { kind: "uups" }
  );

  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();

  console.log("NFT:", nftAddress);


  const Staking = await ethers.getContractFactory("StakingFW");

  const staking = await upgradesApi.deployProxy(
    Staking,
    [deployer.address, nftAddress, tokenAddress],
    { kind: "uups" }
  );

  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();

  console.log("Staking:", stakingAddress);


  const Marketplace =
    await ethers.getContractFactory("MarketplaceFW");

  const marketplace = await upgradesApi.deployProxy(
    Marketplace,
    [
      deployer.address,
      nftAddress,
      tokenAddress,
      deployer.address
    ],
    { kind: "uups" }
  );

  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();

  console.log("Marketplace:", marketplaceAddress);


  const tx = await token.setMinter(stakingAddress);
await tx.wait();
console.log("Staking set as Token minter");

  console.log("\n--- DEPLOYMENT COMPLETE ---");
  console.log("Token Proxy:", tokenAddress);
  console.log("NFT Proxy:", nftAddress);
  console.log("Staking Proxy:", stakingAddress);
  console.log("Marketplace Proxy:", marketplaceAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});