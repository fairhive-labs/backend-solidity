//WaitList
const WaitList = artifacts.require("WaitList");
const Users = artifacts.require("Users");
const POLNToken = artifacts.require("POLNToken");
const max = 10000;
const price = 10;

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(WaitList, POLNToken.address, Users.address, max);
    const waitlist = await WaitList.deployed();
    const poln = await POLNToken.deployed();
    await poln.transfer(waitlist.address, max * price);
};