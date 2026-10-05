import hre from "hardhat";

const { ethers } = await hre.network.create("robinhood");

const TOKEN_PROXY = "0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519";

const token = await ethers.getContractAt("UpgToken", TOKEN_PROXY);

console.log("Token owner:", await token.owner());
console.log("Token minter:", await token.minter());