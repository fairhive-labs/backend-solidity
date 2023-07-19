// contracts/WaitList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Users.sol";
import "./POLNToken.sol";

contract WaitList {
    uint256 public count = 0;
    uint256 public max;
    uint256 public sponsorPrize;
    uint256 public userPrize;

    Users private _users;
    POLNToken private _poln;

    constructor(
        address poln, // POLN address
        address users, // users list address
        uint256 m, // max users in waitlist
        uint256 sp, // sponsor prize
        uint256 up // user prize
    ) {
        _poln = POLNToken(poln);
        _users = Users(users);
        max = m;
        sponsorPrize = sp;
        userPrize = up;
    }
}
