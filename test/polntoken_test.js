const POLNToken = artifacts.require("POLNToken");

contract("POLNToken", (accounts) => {
    it("is deployed", async () => {
        const contract = await POLNToken.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
    });

    it("has expected decimals", async () => {
        const contract = await POLNToken.deployed();
        const d = await contract.decimals();
        const decimals = web3.utils.toBN(d);
        assert(web3.utils.toBN(18).eq(decimals));
    });

    it("has expected name", async () => {
        const contract = await POLNToken.deployed();
        const name = await contract.name();
        assert(name === "fairhive token", `incorrect name, got ${name}, want "fairhive token"`);
    });

    it("has expected symbol", async () => {
        const contract = await POLNToken.deployed();
        const symbol = await contract.symbol();
        assert(symbol === "POLN", `incorrect symbol, got ${symbol}, want "POLN"`);
    });

    it("has expected initial supply", async () => {
        const contract = await POLNToken.deployed();
        const supply = await contract.totalSupply();
        assert("200000000000000000000000000" === supply.toString(), `incorrect supply, got ${supply.toString()}, want "200000000000000000000000000"`);
        const bn = web3.utils.toBN(supply);
        assert(web3.utils.isBN(bn));
        assert(web3.utils.toBN(web3.utils.toWei("200000000", "ether")).eq(bn));
    });

    it("has expected initial balance", async () => {
        const contract = await POLNToken.deployed();
        const supply = await contract.totalSupply();
        const balance = await contract.balanceOf(accounts[0]);
        assert(supply.toString() === balance.toString(), `incorrect balance, got ${balance.toString()}, want ${supply.toString()}`);
    });

    it("should transfer", async () => {
        const contract = await POLNToken.new();
        const a0b1 = web3.utils.toBN(await contract.balanceOf(accounts[0]));
        const a1b1 = web3.utils.toBN(await contract.balanceOf(accounts[1]));
        assert(a1b1.isZero());
        const amount = 1000;
        await contract.transfer(accounts[1], amount);
        const a1b2 = web3.utils.toBN(await contract.balanceOf(accounts[1]));
        assert(!a1b2.isZero());
        assert(web3.utils.toBN(amount).eq(a1b2));
    });
});