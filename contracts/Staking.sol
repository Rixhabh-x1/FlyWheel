// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IUpgToken {
    function mint(address to, uint256 amount) external;
}

contract StakingFW is Initializable, OwnableUpgradeable, UUPSUpgradeable, IERC721Receiver {
    IERC721 public nft;
    IUpgToken public token;
    uint256 public rewardRate;

    struct StakeInfo {
        address owner;
        uint256 stakedAt;
    }

    mapping(uint256 => StakeInfo) public stakes;

    function initialize(address initialOwner, address _nft, address _token) public initializer {
        __Ownable_init(initialOwner);

        nft = IERC721(_nft);
        token = IUpgToken(_token);
        rewardRate = 1e15; 
    }

    function stake(uint256 tokenId) external {
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        stakes[tokenId] = StakeInfo(msg.sender, block.timestamp);
    }

    function unstake(uint256 tokenId) external {
        StakeInfo memory info = stakes[tokenId];
        require(info.owner == msg.sender, "Not staker");

        uint256 duration = block.timestamp - info.stakedAt;
        uint256 reward = duration * rewardRate;

        delete stakes[tokenId];
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        token.mint(msg.sender, reward);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}