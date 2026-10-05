// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarketplaceFW is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    IERC721 public nft;
    IERC20 public token;
    address public treasury;
    uint256 public feePercent;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    function initialize(address initialOwner, address _nft, address _token, address _treasury) public initializer {
        __Ownable_init(initialOwner);

        nft = IERC721(_nft);
        token = IERC20(_token);
        treasury = _treasury;
        feePercent = 5; 
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        nft.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price);
    }

    function buyNFT(uint256 tokenId) external {
        Listing memory item = listings[tokenId];
        require(item.price > 0, "Not listed");

        uint256 fee = (item.price * feePercent) / 100;
        uint256 sellerAmount = item.price - fee;

        delete listings[tokenId];

        token.transferFrom(msg.sender, item.seller, sellerAmount);
        token.transferFrom(msg.sender, treasury, fee);
        nft.transferFrom(address(this), msg.sender, tokenId);
    }

    function cancel(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        delete listings[tokenId];
        nft.transferFrom(address(this), msg.sender, tokenId);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}