// contracts/POLNToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract POLNToken is ERC20 {
    constructor() ERC20("fairhive token", "POLN") {
        uint256 initialSupply = 200000000 * 10 ** decimals();
        _mint(_msgSender(), initialSupply);
    }
}
