// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./UpgToken.sol";

contract UpgTokenV2 is UpgToken {
    function version() external pure returns (string memory) {
        return "V2";
    }
}