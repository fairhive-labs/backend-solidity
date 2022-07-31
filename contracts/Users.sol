// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    address sponsor;
    string email; // off-chain encrypted
    string uuid; // linked with off-chain workloads
    uint256 timestamp;
    UserType utype;
}

contract Users {
    mapping(address => User) private _users;
    address[] private _index;
    mapping(address => uint256) private _sponsors;

    event UserAdded(
        address indexed user,
        UserType indexed utype,
        uint256 timestamp
    );

    function count() public view returns (uint256) {
        return _index.length;
    }

    function add(
        address sponsor,
        string memory email,
        string memory uuid,
        UserType utype
    ) public {
        User memory _user = User(
            msg.sender,
            sponsor,
            email,
            uuid,
            block.timestamp,
            utype
        );

        //@TODO : control user does not exist
        _users[msg.sender] = _user;
        _index.push(msg.sender);
        _sponsors[sponsor]++;

        emit UserAdded(msg.sender, _user.utype, block.timestamp);
    }
}
