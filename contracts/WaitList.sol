// contracts/WaitList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Users.sol";
import "./POLNToken.sol";

contract WaitList {
    uint256 public count = 0;
    uint256 public max;
    uint256 public prize;
    
    Users private _users;
    POLNToken private _poln;

    constructor(
        address poln,
        address users,
        uint256 m,
        uint256 p
    ) {
        _poln = POLNToken(poln);
        _users = Users(users);
        max = m;
        prize = p;
    }
}
