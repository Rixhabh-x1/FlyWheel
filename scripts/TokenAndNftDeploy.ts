import hre from "hardhat";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;

  const Token = await ethers.getContractFactory("RewardToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed at:", await token.getAddress());

  const NFT = await ethers.getContractFactory("FlywheelNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("NFT deployed at:", await nft.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});