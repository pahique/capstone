let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
// - use the contents from proof.json generated from zokrates steps
let proofJson = require('./proof.json');
let proof2Json = require('./proof2.json');

contract('TestSolnSquareVerifier', accounts => {

    let contract;
    const account_one = accounts[0];

    let a = proofJson["proof"]["A"];
    let a_p = proofJson["proof"]["A_p"];
    let b = proofJson["proof"]["B"];
    let b_p = proofJson["proof"]["B_p"];
    let c = proofJson["proof"]["C"];
    let c_p = proofJson["proof"]["C_p"];
    let h = proofJson["proof"]["H"];
    let k = proofJson["proof"]["K"];
    let input = proofJson["input"];

    let a2 = proof2Json["proof"]["A"];
    let a_p2 = proof2Json["proof"]["A_p"];
    let b2 = proof2Json["proof"]["B"];
    let b_p2 = proof2Json["proof"]["B_p"];
    let c2 = proof2Json["proof"]["C"];
    let c_p2 = proof2Json["proof"]["C_p"];
    let h2 = proof2Json["proof"]["H"];
    let k2 = proof2Json["proof"]["K"];
    let input2 = proof2Json["input"];

    before(async function () { 
        let verifierContract = await SquareVerifier.new({from: account_one});
        contract = await SolnSquareVerifier.new(verifierContract.address, {from: account_one});
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('first token minted successfully', async function() { 
        let tokenId = 1;
        await contract.mint(tokenId, a, a_p, b, b_p, c, c_p, h, k, input, {from: account_one});
        let owner = await contract.ownerOf.call(tokenId);
        assert.equal(owner, account_one);
    })

    it('fails to mint a new token using the same solution', async function() {
        let tokenId = 2;
        await expectThrow(contract.mint(tokenId, a, a_p, b, b_p, c, c_p, h, k, input, {from: account_one}));
    })

    it('fails to mint an existing token using a different solution', async function() { 
        let tokenId = 1;
        await expectThrow(contract.mint(tokenId, a2, a_p2, b2, b_p2, c2, c_p2, h2, k2, input2, {from: account_one}));
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('second token minted successfully', async function() { 
        let tokenId = 2;
        await contract.mint(tokenId, a2, a_p2, b2, b_p2, c2, c_p2, h2, k2, input2, {from: account_one});
        let owner = await contract.ownerOf.call(tokenId);
        assert.equal(owner, account_one);
    })
 
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

