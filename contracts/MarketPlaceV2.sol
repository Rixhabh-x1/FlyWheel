// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./MarketPlace.sol";

contract MarketplaceFWV2 is MarketplaceFW {
    function version() external pure returns (string memory) {
        return "V2";
    }
}