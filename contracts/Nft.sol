// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract FlywheelNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 public nextTokenId;
    mapping(uint256 => uint8) public rarity;

    function initialize(address initialOwner) public initializer {
        __ERC721_init("Flywheel NFT", "FWNFT");
        __Ownable_init(initialOwner);    }

    function mint() external payable {
        require(msg.value >= 0.001 ether, "Insufficient payment");
        uint256 tokenId = nextTokenId++;
        rarity[tokenId] = 1;
        _mint(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
    }

    function fuse(uint256 tokenId1, uint256 tokenId2) external {
        require(ownerOf(tokenId1) == msg.sender && ownerOf(tokenId2) == msg.sender, "Not owner of both");
        require(rarity[tokenId1] == rarity[tokenId2], "Rarity must match");
        require(rarity[tokenId1] < 3, "Already max rarity");

        uint8 newRarity = rarity[tokenId1] + 1;

        _burn(tokenId1);
        _burn(tokenId2);

        uint256 newTokenId = nextTokenId++;
        rarity[newTokenId] = newRarity;
        _mint(msg.sender, newTokenId);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}