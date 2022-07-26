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

    struct PreregisteredUser {
        address user;
        address sponsor;
        string email; // off-chain encrypted
        string uuid;
        uint timestamp;
        UserType utype;
    }

    uint public constant max = 10000;
    uint private _count = 0;
    PreregisteredUser[max] private _preregisteredUsers;

    function count() public view returns (uint){
        return _count;
    }
}
