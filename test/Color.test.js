const { assert } = require('chai');

const Color = artifacts.require('../contracts/Color.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("Color", (accounts) => {
    let contract;

    before(async () => {        
        contract = await Color.deployed();
    });

    describe('deployment', async () => {
        it('deploys succesfully', async () => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color')
        })

        it('has symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'CLR')
        })
    })

    describe('minting', async () => {
        it('creates new token', async () => {
            const result = await contract.mint('#173F5F');
            const totalSupply = await contract.totalSupply();
            const event = result.logs[0].args;
            
            //SUCCESS
            assert.equal(totalSupply, 1);
            assert.equal(event.tokenId.toNumber(), 1, 'id correct');
            assert.equal(event.from, 0x0000000000000000000000000000000000000000, 'from correct');
            assert.equal(event.to, accounts[0], 'to correct');

            //FAILURE
            await contract.mint('#173F5F').should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('lists tokens', async () => {
           let current;
           let result = [];
           let expected = ["#173F5F", "#20639B", "#3CAEA3", "#F6D55C", "#ED553B"];

           expected.slice(-4).forEach( async (t) =>  await contract.mint(t));

           const totalSupply = await contract.totalSupply();
           

           for(let i = 0; i < totalSupply; i++){
               current = await contract.colors(i);
               result.push(current);
           }

           assert.equal(result.join(','), expected.join(','));
        })
    })
})