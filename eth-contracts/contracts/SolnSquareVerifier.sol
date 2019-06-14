pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
interface Verifier {

    function verifyTx(
            uint[2] calldata a,
            uint[2] calldata a_p,
            uint[2][2] calldata b,
            uint[2] calldata b_p,
            uint[2] calldata c,
            uint[2] calldata c_p,
            uint[2] calldata h,
            uint[2] calldata k,
            uint[2] calldata input
        ) external returns (bool r);
}

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    Verifier verifierContract;

    constructor(address verifierAddress, string memory name, string memory symbol) CustomERC721Token(name, symbol) public {
        verifierContract = Verifier(verifierAddress);
    }

    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address account;
    }

    // define an array of the above struct
    Solution[] solutions;
    // define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) indexToSolution;

    // Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address account);

    // Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address account) public {
        solutions.push(Solution(index, account));
        emit SolutionAdded(index, account);
    }

    // TODO: Create a function to mint new Non-FungibleToken only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply

}

  


























