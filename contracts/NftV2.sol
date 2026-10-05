// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./Nft.sol";

contract FlywheelNFTV2 is FlywheelNFT {

    function version() external pure returns (string memory) {
        return "V2";
    }
}