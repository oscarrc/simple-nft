// SPDX-License-Identifier: MIT
pragma solidity >=0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFToken is ERC721Enumerable{
    string[] public tokens; //Array to track tokens
    mapping(string => bool ) _tokenExists; //Map to check uniqueness of tokens

    constructor() ERC721("NFToken", "TOKEN") {}

    function mint(string memory _token) public { // For production must use roles
        // Require unique
        require(!_tokenExists[_token]);
        // Add token
        tokens.push(_token);
        uint _id = tokens.length;
        // Call mint function
        _mint(msg.sender, _id);
        // Track token        
        _tokenExists[_token] = true;
    }
}