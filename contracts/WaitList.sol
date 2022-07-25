// contracts/WaitList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract WaitList is Ownable {
    enum UserType {
        ADVISOR,
        AGENT,
        CLIENT,
        CONTRIBUTOR,
        INVESTOR,
        MENTOR,
        TALENT
    }

    struct User {
        address user;
        string email; // off-chain encryption
        string uuid;
        uint256 timestamp;
        UserType utype;
    }

    uint256 constant max = 10000;
    uint256 private count = 0;
    UserType[max] private users;
}
