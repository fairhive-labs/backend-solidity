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

    it("has prize", async () => {
        const contract = await WaitList.deployed();
        const prize = web3.utils.toBN(await contract.prize());
        assert(prize, "prize is undefined");
        assert(web3.utils.isBN(prize), "prize is not a Big Number");
        assert(!prize.isZero(), "prize cannot be 0");
        assert(web3.utils.toBN(10).eq(prize), "prize should be equal to 10");
    });


});