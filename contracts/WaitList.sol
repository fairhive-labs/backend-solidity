// contracts/WaitList.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WaitList {
   
    uint256 public constant max = 10000;

    // function register(User memory user) public {
    //     User memory _user = User(
    //         msg.sender,
    //         user.sponsor,
    //         user.email,
    //         user.uuid,
    //         block.timestamp,
    //         user.utype
    //     );

    //     //@TODO : control user does not exist
    //     _preregisteredUsers[msg.sender] = _user;
    //     _index[_count] = msg.sender;
    //     _count++;
    //     _sponsors[user.sponsor]++;

    //     emit PreregisteredUserAdded(msg.sender, _user.utype, block.timestamp);
    // }
}
