const POLNToken = artifacts.require("POLNToken");

contract("POLNToken", (accounts) => {
    const totalSupply = web3.utils.toBN(web3.utils.toWei("200000000", "ether"));

    it("is deployed", async () => {
        const contract = await POLNToken.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
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
        assert(supply.eq(balance));
    });

    it("should transfer", async () => {
        const contract = await POLNToken.deployed();
        const account0b1 = web3.utils.toBN(await contract.balanceOf(accounts[0]));
        assert(account0b1);
        const account1b1 = web3.utils.toBN(await contract.balanceOf(accounts[1]));
        assert(account1b1);

        assert(!account0b1.isZero());
        assert(account0b1.eq(totalSupply));
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
    //@TODO : test allowance + transferFrom + increase/decreaseAllowance
});