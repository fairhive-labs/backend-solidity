const POLNToken = artifacts.require("POLNToken");

contract("POLNToken", (accounts) => {
    it("is deployed", async () => {
        const contract = await POLNToken.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
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

    //@TODO : control initialSupply and balance
});