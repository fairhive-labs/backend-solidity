// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

enum UserType {
    ADVISOR,
    AGENT,
    INITIATOR,
    CONTRIBUTOR,
    INVESTOR,
    MENTOR,
    CONTRACTOR
}

struct User {
    address user;
    address sponsor;
    string email; // off-chain encrypted
    string uuid; // linked with off-chain tracking
    uint256 timestamp;
    UserType utype;
}

contract Users is Ownable {
    mapping(address => User) private _users;
    address[] private _index;
    mapping(address => address[]) private _sponsors;
    uint256 public maxLimit = 50;

    event UserAdded(
        address indexed user,
        UserType indexed utype,
        uint256 timestamp
    );

    event MaxLimitUpdated(uint256 newLimit, uint256 previousLimit);

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

    function total() external view returns (uint256) {
        return _index.length;
    }

    function contains(address user) private view returns (bool) {
        return
            _users[user].user != address(0) &&
            _users[user].sponsor != address(0) &&
            bytes(_users[user].email).length != 0 &&
            bytes(_users[user].uuid).length != 0 &&
            _users[user].timestamp > 0; // utype not tested, should not require a specific value for undefined utype.
    }

    function get(address user) external view returns (User memory) {
        require(contains(user), "user not found");
        return _users[user];
    }

    function add(
        address sponsor,
        string memory email,
        string memory uuid,
        UserType utype
    ) external {
        require(contains(sponsor), "valid sponsor address required");
        require(!contains(tx.origin), "address already added");
        require(
            bytes(email).length != 0,
            "valid encrypted email address required"
        );
        require(bytes(uuid).length != 0, "valid UUID required");

        User memory _user = User(
            tx.origin,
            sponsor,
            email,
            uuid,
            block.timestamp,
            utype
        );

        _users[tx.origin] = _user;
        _index.push(tx.origin);
        _sponsors[sponsor].push(tx.origin);

        emit UserAdded(tx.origin, _user.utype, block.timestamp);
    }

    function isSponsor(address sponsor) external view returns (bool) {
        return sponsorCount(sponsor) != 0;
    }

    function sponsorCount(address sponsor) public view returns (uint256) {
        return _sponsors[sponsor].length;
    }

    function users(uint256 offset, uint256 limit)
        external
        view
        returns (User[] memory coll)
    {
        require(offset <= _index.length, "offset out of bounds");
        uint256 size = _index.length - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;

        coll = new User[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _users[_index[i + offset]];
        }

        return coll;
    }

    function countByType() external view returns (uint256[] memory) {
        uint256[] memory counting = new uint256[](7);
        for (uint256 i = 0; i < _index.length; i++) {
            uint256 t = uint256(_users[_index[i]].utype); //cast enum into uint256
            counting[t]++;
        }
        return counting;
    }

    function setMaxLimit(uint256 limit) external onlyOwner {
        uint256 previousLimit = maxLimit;
        maxLimit = limit;
        emit MaxLimitUpdated(limit, previousLimit);
    }
}
