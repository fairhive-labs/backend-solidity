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

    it("should add a user", async () => {
        const contract = await WaitList.deployed();
        let count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(count.isZero());

        time = 997358400 // Thursday, August 9, 2001 12:00:00 PM
        utype = 6; // talent

        const tx = await contract.add({
            user: accounts[3], // should override with accounts[1]
            sponsor: accounts[0],
            email: "h4sh3mail",
            uuid: "uuid-123456789",
            timestamp: time,
            utype: utype
        }, { from: accounts[1] });

        count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(web3.utils.toBN(1).eq(count));

        const expectedEvent = "PreregisteredUserAdded";
        const actualEvent = tx.logs[0].event;
        assert(actualEvent, expectedEvent, "events should match");
        assert(tx.logs[0].args.user, accounts[1], "user address should be overridden");
        assert(web3.utils.toBN(utype).eq(tx.logs[0].args.utype), `user type should be (${utype})`);
        assert(!(web3.utils.toBN(997358400).eq(tx.logs[0].args.timestamp)), `timestamp cannot be ${new Date(time)}`);
    });

});