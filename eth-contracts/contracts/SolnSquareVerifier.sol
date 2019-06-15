pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
interface SquareVerifier {

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

    SquareVerifier verifierContract;

    constructor(address verifierAddress, string memory name, string memory symbol) CustomERC721Token(name, symbol) public {
        verifierContract = SquareVerifier(verifierAddress);
    }

    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address sender;
    }

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) internal solutions;
    uint256 internal indexCount = 0;

    // Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address sender);

    // Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 key, address sender) internal {
        indexCount = indexCount.add(1);
        solutions[key] = Solution(indexCount, sender);
        emit SolutionAdded(indexCount, sender);
    }

    // Create a function to mint new Non-FungibleToken only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mint(
        uint256 tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
        require(solutions[key].index != 0, "Solution already exists");
        require(verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "Zokrates verification failed");
        addSolution(key, msg.sender);
        super.mint(msg.sender, tokenId);
    }

}
