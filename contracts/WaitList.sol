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
        string uuid; // linked with off-chain workloads
        uint256 timestamp;
        UserType utype;
    }

    event PreregisteredUserAdded(
        address indexed user,
        UserType indexed utype,
        uint256 indexed timestamp
    );

    uint256 private _count = 0;
    uint256 public constant max = 10000;
    mapping(address => PreregisteredUser) private _preregisteredUsers;
    address[max] private _index;
    mapping(address => uint256) private _sponsors;

    function count() public view returns (uint256) {
        return _count;
    }

    function add(PreregisteredUser memory user) public {
        PreregisteredUser memory _user = PreregisteredUser(
            msg.sender,
            user.sponsor,
            user.email,
            user.uuid,
            block.timestamp,
            user.utype
        );

        //@TODO : control user does not exist
        _preregisteredUsers[msg.sender] = _user;
        _index[_count] = msg.sender;
        _count++;
        _sponsors[user.sponsor]++;

        emit PreregisteredUserAdded(msg.sender, _user.utype, block.timestamp);
    }
}
