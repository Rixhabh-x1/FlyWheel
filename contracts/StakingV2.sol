// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./Staking.sol";

contract StakingFWV2 is StakingFW {
    function version() external pure returns (string memory) {
        return "V2";
    }
}