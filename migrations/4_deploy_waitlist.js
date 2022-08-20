//WaitList
const WaitList = artifacts.require("WaitList");
const Users = artifacts.require("Users");
const POLNToken = artifacts.require("POLNToken");
const max = 1000;

module.exports = function (deployer) {
    deployer.deploy(WaitList, max, Users.address, POLNToken.address);
};