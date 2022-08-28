const Users = artifacts.require("Users");

contract("Users", (accounts) => {

    const sponsor = accounts[0];

    it("is deployed", async () => {
        const contract = await Users.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    it("has expected initial total", async () => {
        const contract = await Users.deployed();
        const total = web3.utils.toBN(await contract.total());
        assert(total, "total is undefined");
        assert(web3.utils.isBN(total), "total is not a Big Number");
        assert(!total.isZero(), "total cannot be 0");
        assert(web3.utils.toBN(1).eq(total), "total should be equal to 1");
    });

    it("should get a user", async () => {
        const contract = await Users.deployed();
        const [a0, a1] = [accounts[0], accounts[1]];

        //test first user
        const u0 = await contract.get(a0);
        assert(a0 === u0.user);
        assert(a0 === u0.sponsor); // first user is its own sponsor
        assert(u0.email === "9a3ca5351679ea72cb2554284e4f11b7a29bf312ef63abdee4ca99635a056fad3db5f0eac25402b49eb620ecaf41326a1685");
        assert(u0.uuid === "f9a5fb84-cdd2-46ed-aa27-44426f5e99c6");
        assert(u0.timestamp == 1650123201);
        assert(u0.utype == 5); // mentor

        try {
            const u1 = await contract.get(a1);
            assert(false, `should not get user ${a1}`);
        } catch (err) {
            assert(err, `error getting user ${a1} is expected`);
            if (err.reason) {
                assert(err.reason === "user not found");
            }
        }

    });

    it("should add a user", async () => {
        const contract = await Users.deployed();
        let total = web3.utils.toBN(await contract.total());
        assert(total, "total is undefined");
        assert(web3.utils.isBN(total), "total is not a Big Number");
        assert(!total.isZero(), "total cannot be 0");

        time = 997358400 // Thursday, August 9, 2001 12:00:00 PM
        utype = 6; // talent

        const tx = await contract.add(sponsor, "h4sh3mail", "uuid-123456789", utype, { from: accounts[1] });

        total = web3.utils.toBN(await contract.total());
        assert(total, "total after adding user is undefined");
        assert(web3.utils.isBN(total), "total after adding user is not a Big Number");
        const expectedCount = 2;
        assert(web3.utils.toBN(expectedCount).eq(total), `total should be equal to ${expectedCount}`);

        const expectedEvent = "UserAdded";
        const actualEvent = tx.logs[0].event;
        assert(actualEvent, expectedEvent, "adding user events should match");
        assert(tx.logs[0].args.user, accounts[1], "user address should be overridden");
        assert(web3.utils.toBN(utype).eq(tx.logs[0].args.utype), `user type should be (${utype})`);
        assert(!(web3.utils.toBN(997358400).eq(tx.logs[0].args.timestamp)), `timestamp cannot be ${new Date(time)}`);
    });

    it("should contain a sponsor", async () => {
        const contract = await Users.deployed();
        assert(await contract.isSponsor(sponsor), `${sponsor} should be a valid sponsor`);
        assert(!(await contract.isSponsor(accounts[2])), `${accounts[2]} should not be a valid sponsor`);

        let sponsorCount = await contract.sponsorCount(sponsor);
        assert(web3.utils.toBN(1).eq(sponsorCount), `sponsor count of ${sponsor} should be equal to 1`);
        sponsorCount = await contract.sponsorCount(accounts[2]);
        assert(web3.utils.toBN(sponsorCount).isZero(), `sponsor count of ${accounts[2]} should be equal to 0 because ${accounts[2]} is not a sponsor`);
    });

    it("should list users with offsets / limits", async () => {
        const contract = await Users.deployed();
        // add multiple users
        const ids = [];
        for (let i = 0; i < 7; i++) {
            ids.push(`uuid-${2 + i}`);
            await contract.add(sponsor, `h4sh3mail-${2 + i}`, `uuid-${2 + i}`, i % 7, { from: accounts[2 + i] });
        }
        const total = web3.utils.toBN(await contract.total());
        const expectedCount = 9;
        assert(web3.utils.toBN(expectedCount).eq(total), `total should be equal to ${expectedCount}`);

        let limit = 10;
        let offset = 0;
        let users = await contract.users(offset, limit);
        assert(users, "users should be defined");
        assert(users.length == expectedCount, `users length should be ${expectedCount}`);

        limit = 1000;
        users = await contract.users(offset, limit);
        assert(users, "users should be defined");
        assert(users.length != limit, `users length should not be ${limit} but ${expectedCount}`);

        limit = 5;
        users = await contract.users(offset, limit);
        assert(users, "users should be defined");
        assert(users.length == limit, `users length should  be ${limit}`);

        offset = 2;
        users = await contract.users(offset, limit);
        assert(users, "users should be defined");
        assert(users.length == limit, `users length should  be ${limit}`);
        for (let i = 0; i < users.length; i++) {
            id = users[i].uuid;
            assert(ids.findIndex(v => v == id) !== -1, `no user with uuid ${id} in users list`);
        }

        offset = expectedCount - limit + 1;
        users = await contract.users(offset, limit);
        assert(users, "users should be defined");
        assert(users.length !== limit, `users length should not be ${limit}`);
        assert(users.length == expectedCount - limit, `users length should be ${expectedCount - limit}`);
        for (let i = 0; i < users.length; i++) {
            id = users[i].uuid;
            assert(ids.findIndex(v => v == id) !== -1, `no user with uuid ${id} in users list`);
        }

        offset = 1000;
        try {
            await contract.users(offset, limit);
            assert(false, "should not get users list with offset=1000");
        } catch (err) {
            assert(err, "getting users list with offset=1000 should revert");
            if (err.reason) {
                assert(err.reason === "offset out of bounds");
            }
        }
    });

    it("should count users by type", async () => {
        const userType = [
            'advisor',
            'agent',
            'client',
            'contributor',
            'investor',
            'mentor',
            'talent'
        ];
        const expectedCount = [1, 1, 1, 1, 1, 2, 2];

        const contract = await Users.deployed();
        assert(contract, "contract is not deployed");

        const counting = await contract.countByType();
        assert(expectedCount.length === counting.length, `counting length should be ${expectedCount.length}`);
        for (let i = 0; i < counting.length; i++) {
            assert(web3.utils.isBN(counting[i]), `count of ${userType[i]} should be a Big Number`);
            assert(web3.utils.toBN(expectedCount[i]).eq(counting[i]), `count of ${userType[i]} should be a ${expectedCount[i]}`);
        }
    });

    it("should update maxLimit", async () => {
        const contract = await Users.deployed();
        assert(contract, "contract is not deployed");

        let maxLimit = await contract.maxLimit();
        assert(web3.utils.isBN(maxLimit));
        assert(web3.utils.toBN(50).eq(maxLimit));

        // increase
        let tx = await contract.setMaxLimit(100);
        let expectedEvent = "MaxLimitUpdated";
        let actualEvent = tx.logs[0].event;
        assert(actualEvent, expectedEvent, "updating maxLimit events should match");
        assert(web3.utils.isBN(tx.logs[0].args.newLimit));
        assert(web3.utils.isBN(tx.logs[0].args.previousLimit));
        assert(web3.utils.toBN(100).eq(tx.logs[0].args.newLimit));
        assert(web3.utils.toBN(50).eq(tx.logs[0].args.previousLimit));
        maxLimit = await contract.maxLimit();
        assert(web3.utils.isBN(maxLimit));
        assert(web3.utils.toBN(100).eq(maxLimit));

        // decrease 
        tx = await contract.setMaxLimit(10);
        expectedEvent = "MaxLimitUpdated";
        actualEvent = tx.logs[0].event;
        assert(actualEvent, expectedEvent, "updating maxLimit events should match");
        assert(web3.utils.isBN(tx.logs[0].args.newLimit));
        assert(web3.utils.isBN(tx.logs[0].args.previousLimit));
        assert(web3.utils.toBN(10).eq(tx.logs[0].args.newLimit));
        assert(web3.utils.toBN(100).eq(tx.logs[0].args.previousLimit));
        maxLimit = await contract.maxLimit();
        assert(web3.utils.isBN(maxLimit));
        assert(web3.utils.toBN(10).eq(maxLimit));

        try {
            await contract.setMaxLimit(50, { from: accounts[1] });
            assert(false, "owner should be the only one allowed to update maxLimit variable");
        } catch (err) {
            assert(err, "unauthorized maxLimit updates should revert");
            if (err.reason) {
                assert(err.reason === "Ownable: caller is not the owner");
            }
        }
    });
});