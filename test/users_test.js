const Users = artifacts.require("Users");

contract("Users", (accounts) => {
    it("is deployed", async () => {
        const contract = await Users.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    it("has expected initial count", async () => {
        const contract = await Users.deployed();
        const count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(count.isZero());
    });

    it("should add a user", async () => {
        const contract = await Users.deployed();
        let count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(count.isZero());

        time = 997358400 // Thursday, August 9, 2001 12:00:00 PM
        utype = 6; // talent

        const tx = await contract.add(accounts[0], "h4sh3mail", "uuid-123456789", utype, { from: accounts[1] });

        count = web3.utils.toBN(await contract.count());
        assert(count);
        assert(web3.utils.isBN(count));
        assert(web3.utils.toBN(1).eq(count));

        const expectedEvent = "UserAdded";
        const actualEvent = tx.logs[0].event;
        assert(actualEvent, expectedEvent, "events should match");
        assert(tx.logs[0].args.user, accounts[1], "user address should be overridden");
        assert(web3.utils.toBN(utype).eq(tx.logs[0].args.utype), `user type should be (${utype})`);
        assert(!(web3.utils.toBN(997358400).eq(tx.logs[0].args.timestamp)), `timestamp cannot be ${new Date(time)}`);
    });

});