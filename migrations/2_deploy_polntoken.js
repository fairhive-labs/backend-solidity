//POLNToken
const POLNToken = artifacts.require("POLNToken");

module.exports = function(deployer){
    deployer.deploy(POLNToken);
};