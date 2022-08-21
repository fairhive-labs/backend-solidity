const WaitList = artifacts.require("WaitList");

contract("WaitList", (accounts) => {

    const sponsor = accounts[0];

    it("is deployed", async () => {
        const contract = await WaitList.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    it("has expected initial count", async () => {
        const contract = await WaitList.deployed();
        const count = web3.utils.toBN(await contract.count());
        assert(count, "count is undefined");
        assert(web3.utils.isBN(count), "count is not a Big Number");
        assert(count.isZero(), "count must be 0");
    });

    it("has max", async () => {
        const contract = await WaitList.deployed();
        const max = web3.utils.toBN(await contract.max());
        assert(max, "max is undefined");
        assert(web3.utils.isBN(max), "max is not a Big Number");
        assert(!max.isZero(), "max cannot be 0");
        assert(web3.utils.toBN(10000).eq(max), "max should be equal to 10000");
    });

    it("has expected prizes", async () => {
        const contract = await WaitList.deployed();

        const sponsorPrize = web3.utils.toBN(await contract.sponsorPrize());
        assert(sponsorPrize, "sponsorPrize is undefined");
        assert(web3.utils.isBN(sponsorPrize), "sponsorPrize is not a Big Number");
        assert(!sponsorPrize.isZero(), "sponsorPrize cannot be 0");
        assert(web3.utils.toBN(10).eq(sponsorPrize), "sponsorPrize should be equal to 10");

        const userPrize = web3.utils.toBN(await contract.userPrize());
        assert(userPrize, "userPrize is undefined");
        assert(web3.utils.isBN(userPrize), "userPrize is not a Big Number");
        assert(!userPrize.isZero(), "userPrize cannot be 0");
        assert(web3.utils.toBN(10).eq(userPrize), "userPrize should be equal to 10");
    });


});