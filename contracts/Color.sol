// SPDX-License-Identifier: MIT
pragma solidity >=0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721Enumerable{
    string[] public colors; //Array to track tokens
    mapping(string => bool ) _colorExists; //Map to check uniqueness of tokens

    constructor() ERC721("Color", "CLR") {}

    function mint(string memory _color) public { // For production must use roles
        // Require unique
        require(!_colorExists[_color]);
        // Add token
        colors.push(_color);
        uint _id = colors.length;
        // Call mint function
        _mint(msg.sender, _id);
        // Track token        
        _colorExists[_color] = true;
    }
}