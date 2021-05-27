const NFToken = artifacts.require('../contracts/NFToken.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("NFToken", (accounts) => {
    let contract;

    describe('deplyment', async () => {
        it('deploys succesfully', async () => {
            contract = await NFToken.deployed();
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })
})