const WaitList = artifacts.require("WaitList");

contract("WaitList", (accounts) => {
    it("is deployed", async () => {
        const contract = await WaitList.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    it("has expected max value", async () => {
        const contract = await WaitList.deployed();
        const max = web3.utils.toBN(await contract.max());
        assert(max);
        assert(web3.utils.isBN(max));
        assert(web3.utils.toBN(10000).eq(max));
    });

    it("has expected initial count", async () => {
        const contract = await WaitList.deployed();
        const count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(count.isZero());
    });

});