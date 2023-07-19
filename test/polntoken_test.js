const POLNToken = artifacts.require("POLNToken");

contract("POLNToken", (accounts) => {
    const totalSupply = web3.utils.toBN(web3.utils.toWei("200000000", "ether"));

    console.log("Accounts:")
    for (i = 0; i < accounts.length; i++) {
        console.log(`[${i}] ${accounts[i]}`);
    }

    it("is deployed", async () => {
        const contract = await POLNToken.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    it("has expected decimals", async () => {
        const contract = await POLNToken.deployed();
        const decimals = web3.utils.toBN(await contract.decimals());
        assert(decimals);
        assert(decimals.eq(web3.utils.toBN(18)));
    });

    it("has expected name", async () => {
        const contract = await POLNToken.deployed();
        const name = await contract.name();
        assert(name === "fairhive token");
    });

    it("has expected symbol", async () => {
        const contract = await POLNToken.deployed();
        const symbol = await contract.symbol();
        assert(symbol === "POLN", `incorrect symbol, got ${symbol}, want "POLN"`);
    });

    it("has expected initial supply", async () => {
        const contract = await POLNToken.deployed();
        let supply = await contract.totalSupply();
        assert(supply);
        assert(supply.toString() === "200000000000000000000000000");

        supply = web3.utils.toBN(supply);
        assert(web3.utils.isBN(supply));
        assert(!supply.isZero())
        assert(supply.eq(totalSupply));
    });

    it("has expected initial balance", async () => {
        const contract = await POLNToken.deployed();
        const supply = web3.utils.toBN(await contract.totalSupply());
        assert(supply);
        const balance = web3.utils.toBN(await contract.balanceOf(accounts[0]));
        assert(balance);
        assert(supply.gte(balance));
    });

    it("should transfer", async () => {
        const contract = await POLNToken.deployed();
        const account0b1 = web3.utils.toBN(await contract.balanceOf(accounts[0]));
        assert(account0b1);
        const account1b1 = web3.utils.toBN(await contract.balanceOf(accounts[1]));
        assert(account1b1);

        assert(!account0b1.isZero());
        assert(totalSupply.gte(account0b1));
        assert(account1b1.isZero());

        const amount = web3.utils.toBN(1000);
        assert(await contract.transfer(accounts[1], amount.toNumber()));// check return is true
        const account0b2 = web3.utils.toBN(await contract.balanceOf(accounts[0]));
        assert(account0b2);
        const account1b2 = web3.utils.toBN(await contract.balanceOf(accounts[1]));
        assert(account1b2);

        assert(!account0b2.isZero());
        assert(account0b2.lte(totalSupply.sub(amount)));
        assert(!account1b2.isZero());
        assert(account1b2.eq(amount));
    });

    it("should check default allowance", async () => {
        const contract = await POLNToken.deployed();
        const acc0acc1Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[1]));
        assert(acc0acc1Allowance);
        assert(acc0acc1Allowance.isZero());
    });

    it("should approve", async () => {
        const contract = await POLNToken.deployed();
        let acc0acc2Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[2]));
        assert(acc0acc2Allowance);
        assert(acc0acc2Allowance.isZero());

        const amount = web3.utils.toBN(1000);
        assert(await contract.approve(accounts[2], amount.toNumber()));
        acc0acc2Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[2]));
        assert(acc0acc2Allowance);
        assert(!acc0acc2Allowance.isZero());
        assert(acc0acc2Allowance.eq(amount));
    });

    it("should increase allowance + transferFrom", async () => {
        const contract = await POLNToken.deployed();
        const amount = web3.utils.toBN(2000);
        assert(await contract.increaseAllowance(accounts[3], amount.toNumber()));

        let acc0acc3Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[3]));
        assert(acc0acc3Allowance);
        assert(acc0acc3Allowance.eq(amount));

        let balanceAccount4 = web3.utils.toBN(await contract.balanceOf(accounts[4]));
        assert(balanceAccount4);
        assert(balanceAccount4.isZero());

        const payment = web3.utils.toBN(1000);
        assert(await contract.transferFrom(accounts[0], accounts[4], payment.toNumber(), { from: accounts[3] }));
        balanceAccount4 = web3.utils.toBN(await contract.balanceOf(accounts[4]));
        assert(balanceAccount4);
        assert(!balanceAccount4.isZero());
        assert(balanceAccount4.eq(payment));

        acc0acc3Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[3]));
        assert(acc0acc3Allowance);
        assert(acc0acc3Allowance.eq(amount.sub(payment)));
    });

    it("should increase and decrease allowance", async () => {
        const contract = await POLNToken.deployed();
        const amount = web3.utils.toBN(2000);
        assert(await contract.increaseAllowance(accounts[4], amount.toNumber()));

        let acc0acc4Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[4]));
        assert(acc0acc4Allowance);
        assert(acc0acc4Allowance.eq(amount));

        const value = web3.utils.toBN(1000);
        assert(await contract.decreaseAllowance(accounts[4], value.toNumber()));

        acc0acc4Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[4]));
        assert(acc0acc4Allowance);
        assert(acc0acc4Allowance.eq(amount.sub(value)));

        assert(await contract.decreaseAllowance(accounts[4], value.toNumber()));

        acc0acc4Allowance = web3.utils.toBN(await contract.allowance(accounts[0], accounts[4]));
        assert(acc0acc4Allowance);
        assert(acc0acc4Allowance.isZero());

        try {
            await contract.decreaseAllowance(accounts[4], value.toNumber());
            assert(false);
        } catch (err) {
            assert(err);
            if (err.reason) {
                assert(err.reason === "ERC20: decreased allowance below zero");
            }
        }
    });
});