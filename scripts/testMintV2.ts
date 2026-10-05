import hre from "hardhat";
const { ethers} = await hre.network.create("robinhood");

const NFT_PROXY = "0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3"

const [wallet] = await ethers.getSigners();

const nft= await ethers.getContractAt("FlywheelNFTV2", NFT_PROXY);

console.log("Wallet", wallet.address);
console.log("NFT Version", await nft.version());

const tx = await nft.mint({
    value: ethers.parseEther("0.001"),});

await tx.wait();

console.log("NFT minted successfully");

const nextId = await nft.nextTokenId();
const tokenId = nextId - 1n;

console.log("Minted NFT ID:", tokenId);
console.log("Owner:", await nft.ownerOf(tokenId));
console.log("Rarity:", await nft.rarity(tokenId));

