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
    string uuid; // linked with off-chain tracking
    uint256 timestamp;
    UserType utype;
}

contract Users {
    mapping(address => User) private _users;
    address[] private _index;
    mapping(address => address[]) private _sponsors;

    event UserAdded(
        address indexed user,
        UserType indexed utype,
        uint256 timestamp
    );

    constructor() {
        //first user
        _users[msg.sender] = User(
            msg.sender,
            msg.sender,
            "9a3ca5351679ea72cb2554284e4f11b7a29bf312ef63abdee4ca99635a056fad3db5f0eac25402b49eb620ecaf41326a1685",
            "f9a5fb84-cdd2-46ed-aa27-44426f5e99c6",
            1650123201,
            UserType.MENTOR
        );
        
        _index.push(msg.sender);
    }

    function count() public view returns (uint256) {
        return _index.length;
    }

    function exist(address user) private view returns (bool) {
        return
            _users[user].sponsor != address(0) &&
            bytes(_users[user].uuid).length != 0 &&
            _users[user].timestamp > 0;
    }

    function add(
        address sponsor,
        string memory email,
        string memory uuid,
        UserType utype
    ) public {
        require(exist(sponsor), "Sponsor's address required");
        require(!exist(msg.sender), "Can't add an already used address");
        require(
            bytes(email).length != 0,
            "Valid encrypted email address required"
        );
        require(bytes(uuid).length != 0, "Valid UUID required");

        User memory _user = User(
            msg.sender,
            sponsor,
            email,
            uuid,
            block.timestamp,
            utype
        );

        _users[msg.sender] = _user;
        _index.push(msg.sender);
        _sponsors[sponsor].push(msg.sender);

        emit UserAdded(msg.sender, _user.utype, block.timestamp);
    }

    function isSponsor(address sponsor) public view returns (bool) {
        return sponsorCount(sponsor) != 0;
    }

    function sponsorCount(address sponsor) public view returns (uint256) {
        return _sponsors[sponsor].length;
    }
}
