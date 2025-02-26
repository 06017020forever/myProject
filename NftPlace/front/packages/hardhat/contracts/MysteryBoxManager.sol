// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./console.sol";

contract MysteryBoxManager is Ownable {
	using Counters for Counters.Counter;

	uint256[] public availableTokens;
	event BuyMysteryBox(uint256 indexed tokenId, address indexed buyer);

	function _buyMysteryBox(
		address buyer,
		address seller,
		uint256 mysteryBoxPrice
	) internal returns (uint256) {
		require(
			availableTokens.length > 0,
			"No tokens left in the mystery box"
		);

		uint256 randomIndex = uint256(
			keccak256(abi.encodePacked(block.timestamp, buyer))
		) % availableTokens.length;
		uint256 mysteryTokenId = availableTokens[randomIndex];

		require(seller != buyer, "Buyer cannot be the seller");
		availableTokens[randomIndex] = availableTokens[
			availableTokens.length - 1
		];
		availableTokens.pop();

		(bool success, ) = seller.call{ value: mysteryBoxPrice }("");
		require(success, "Transfer to seller failed");

		emit BuyMysteryBox(mysteryTokenId, buyer);

		return mysteryTokenId;
	}

	function _addNftToMysteryBox(uint256 tokenId) internal {
		require(!_isTokenInBox(tokenId), "Token is already in the box");

		availableTokens.push(tokenId);
	}

	function _isTokenInBox(uint256 tokenId) internal view returns (bool) {
		for (uint256 i = 0; i < availableTokens.length; i++) {
			if (availableTokens[i] == tokenId) {
				return true;
			}
		}
		return false;
	}

	// function _getAvailableTokens() internal view returns (NftItem[] memory) {
	//     uint256 totalBlindNfts = availableTokens.length;
	//     NftItem[] memory items = new NftItem[](totalBlindNfts);
	//     for (uint256 i = 0; i < totalBlindNfts; i++) {
	//         uint256 tokenId = availableTokens[i];
	//         items[i] = _idToNftItem[tokenId];
	//     }
	//     return items;
	// }
}
