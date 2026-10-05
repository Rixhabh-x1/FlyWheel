export const nftAbi = [
  "function nextTokenId() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function rarity(uint256 tokenId) view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];