const WaitList = artifacts.require("WaitList");

contract("WaitList", (accounts) => {

    const sponsor = accounts[0];

    it("is deployed", async () => {
        const contract = await WaitList.deployed();
        assert(contract, "contract is not deployed");
        assert(contract.address, "contract has no address or empty address");
        console.log(`${contract.address}`);
    });

    
});