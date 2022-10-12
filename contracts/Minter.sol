// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Minter is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Sketches Tokens", "SKT") {}

    /** modifier to check for the following conditions:
        * 1. NFT exists
        * 2. Caller is the owner of the NFT
    
    */
    modifier validCallerAndToken(uint tokenId){
        require(_exists(tokenId), "Invalid tokenId entered");
        require(_isApprovedOrOwner(msg.sender, tokenId), "Only owner or approved operator can gift the NFT");
        _;
    }

    /**
        * @dev allow users to mint the NFT that will represent the Sketch
     */
    function mint(string calldata _tokenURI) public returns (uint256) {
        require(bytes(_tokenURI).length > 7, "Enter a valid token uri"); //ipfs uri starts with "ipfs://"
        uint256 id = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURI);
        return (id);
    }

    /**
        * @dev allow users to gift a sketch's NFT to a receiver
     */
    function giftToken(uint256 tokenId, address _receiver) public validCallerAndToken(tokenId) {
        require(_receiver != address(0), "Invalid address entered");
        _transfer(msg.sender,_receiver, tokenId);
    }

    /**
        @dev allow authorized callers to delete and burn a sketch.
     */
    function deleteToken(uint tokenId) public validCallerAndToken(tokenId) {
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
