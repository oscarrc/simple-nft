const { assert } = require('chai');

const NFToken = artifacts.require('../contracts/NFToken.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("NFToken", (accounts) => {
    let contract;

    before(async () => {        
        contract = await NFToken.deployed();
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
            assert.equal(name, 'NFToken')
        })

        it('has symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'TOKEN')
        })
    })

    describe('minting', async () => {
        it('creates new token', async () => {
            const result = await contract.mint('token0');
            const totalSupply = await contract.totalSupply();
            const event = result.logs[0].args;
            
            //SUCCESS
            assert.equal(totalSupply, 1);
            assert.equal(event.tokenId.toNumber(), 1, 'id correct');
            assert.equal(event.from, 0x0000000000000000000000000000000000000000, 'from correct');
            assert.equal(event.to, accounts[0], 'to correct');

            //FAILURE
            await contract.mint('token0').should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('lists tokens', async () => {
           let current;
           let result = [];
           let expected = [0,1,2,3].map(t => `token${t}`);

           [1,2,3].forEach( async (t) =>  await contract.mint(`token${t}`));
           const totalSupply = await contract.totalSupply();
           

           for(let i = 1; i <= totalSupply; i++){
               current = await contract.tokens(i - 1);
               result.push(current);
           }

           assert.equal(result.join(','), expected.join(','));
        })
    })
})