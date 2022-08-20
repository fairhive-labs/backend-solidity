// contracts/WaitList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Users.sol";
import "./POLNToken.sol";

contract WaitList {
    uint256 public max;
    uint256 public count = 0;

    Users private _users;
    POLNToken private _poln;

    constructor(
        address p,
        address u,
        uint256 m
    ) {
        _poln = POLNToken(p);
        _users = Users(u);
        max = m;
    }
}
