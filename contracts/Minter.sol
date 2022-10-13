// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Minter is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Sketches Tokens", "SKT") {}

    uint mintFee = 0.1 ether;

    function mint(string memory _tokenURI) external payable returns (uint256) {
        require(bytes(_tokenURI).length > 7, "Enter a valid token uri"); //ipfs uri starts with "ipfs://"
        require(msg.value == mintFee, "sendFee");
        uint256 id = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURI);
        return (id);
    }

    function withdrawFee() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function giftToken(uint256 tokenId, address _receiver) external {
        require(tokenId < _tokenIdCounter.current(), "Invalid tokenId entered");
        require(_receiver != address(0), "Invalid address entered");
        _transfer(msg.sender,_receiver, tokenId);
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