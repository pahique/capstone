let CapstoneRealStateToken = artifacts.require('CapstoneRealStateToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];
    const account_six = accounts[5];

    describe('match erc721 spec', function () {

        beforeEach(async function () { 
            this.contract = await CapstoneRealStateToken.new({from: account_one});

            // mint multiple tokens
            await this.contract.mint(account_two, 1);
            await this.contract.mint(account_two, 2);
            await this.contract.mint(account_two, 3);
            await this.contract.mint(account_three, 4);
            await this.contract.mint(account_three, 5);
            await this.contract.mint(account_five, 6);
            await this.contract.mint(account_six, 7);
            await this.contract.mint(account_six, 8);
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, 8);
        })

        it('should get token balance', async function () { 
            let balance_two = await this.contract.balanceOf.call(account_two);
            assert.equal(balance_two, 3);
            let balance_three = await this.contract.balanceOf.call(account_three);
            assert.equal(balance_three, 2);
            let balance_four = await this.contract.balanceOf.call(account_four);
            assert.equal(balance_four, 0);
            let balance_five = await this.contract.balanceOf.call(account_five);
            assert.equal(balance_five, 1);
            let balance_six = await this.contract.balanceOf.call(account_six);
            assert.equal(balance_six, 2);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId = 3;
            let tokenUri = await this.contract.tokenURI.call(tokenId);
            assert.equal(tokenUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + tokenId);
            tokenId = 4;
            tokenUri = await this.contract.tokenURI.call(tokenId);
            assert.equal(tokenUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + tokenId);
            tokenId = 1;
            tokenUri = await this.contract.tokenURI.call(tokenId);
            assert.equal(tokenUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + tokenId);
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = 3;
            await this.contract.transferFrom(account_two, account_three, tokenId, {from: account_two});
            assert.equal(await this.contract.ownerOf.call(tokenId), account_three);
            assert.equal(await this.contract.balanceOf.call(account_two), 2);
            assert.equal(await this.contract.balanceOf.call(account_three), 3);
        })
    });


    describe('have ownership properties', function () {

        beforeEach(async function () { 
            this.contract = await CapstoneRealStateToken.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await expectThrow(this.contract.mint(account_two, 9, {from: account_two}));
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call();
            assert.equal(owner, account_one);
        })

    });
})

let expectThrow = async function(promise) {
    try {
        await promise;
    } catch(error) {
        assert.exists(error);
        return;
    }
    assert.fail("Expected an error but didn't see one");
}


