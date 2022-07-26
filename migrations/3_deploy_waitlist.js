//WaitList
const WaitList = artifacts.require("WaitList");

module.exports = function(deployer){
    deployer.deploy(WaitList);
};