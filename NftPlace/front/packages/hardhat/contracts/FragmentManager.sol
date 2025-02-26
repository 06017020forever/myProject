// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./console.sol";

contract FragmentManager is Ownable {
	struct NFTFragment {
		uint256 tokenId;
		address tokenSeller;
		address tokenCreator;
		bool isListedFragSale;
		string tokenUri;
	}

	mapping(uint256 => NFTFragment) public nftFragment; // 每个 tokenId 对应的nft状态信息

	struct Fragment {
		uint256 tokenId;
		uint256 fragId;
		uint256 fragprice;
		address fragbuyer;
		address fragseller;
		address fragcreator;
		bool isBuied;
		string fragImageUri;
	}

	// Mapping from tokenId to another mapping of fragId to Fragment
	mapping(uint256 => mapping(uint256 => Fragment)) private _tokenFragments;

	// Mapping from tokenId to an array of fragIds
	mapping(uint256 => uint256[]) private _tokenFragIds;

	// Event for fragment creation
	event FragmentCreated(uint256 tokenId, uint256 fragId, address creator);

	// 添加事件
	event FragmentPurchased(
		uint256 indexed tokenId,
		uint256 indexed fragId,
		address indexed buyer
	);

	//碎片化nft
	function createFragmentizationNFT(
		uint256 tokenId,
		uint256 totalShares,
		string[] memory imageUrls,
		uint256 price,
		address creator,
		string memory tokenUri
	) public {
		require(totalShares > 0, "totalShares must be greater than 0");
		require(
			imageUrls.length == totalShares,
			"Image URLs count must match the total shares"
		);

		for (uint256 i = 0; i < totalShares; i++) {
			// Assign each fragment to the mapping using fragId
			_tokenFragments[tokenId][i + 1] = Fragment({
				tokenId: tokenId,
				fragId: i + 1,
				fragprice: price,
				fragbuyer: address(0),
				fragseller: creator,
				fragcreator: creator,
				isBuied: true,
				fragImageUri: imageUrls[i]
			});
			_tokenFragIds[tokenId].push(i + 1);

			nftFragment[tokenId] = NFTFragment({
				tokenId: tokenId,
				tokenSeller: creator,
				tokenCreator: creator,
				isListedFragSale: true,
				tokenUri: tokenUri
			});

			emit FragmentCreated(tokenId, i + 1, creator);
		}
	}

	//购买碎片化NFT
	function purchaseNFragmentft(
		uint256 tokenId,
		uint256 fragId,
		uint256 amount,
		address buyadd
	) external payable {
		// 检查该 tokenId 和 fragId 是否存在
		require(
			_tokenFragments[tokenId][fragId].fragId != 0,
			"Fragment does not exist"
		);
		// 获取对应的碎片信息
		Fragment storage fragment = _tokenFragments[tokenId][fragId];
		// 检查支付金额是否等于碎片价格
		require(amount == fragment.fragprice, "Incorrect payment amount");
		console.log("1deqeq", msg.sender);
		// 检查当前买家是否已经是该碎片的所有者
		require(buyadd != fragment.fragseller, "Buyer cannot be the seller");
		console.log("dawda", fragment.fragseller);
		// 转账给卖家
		(bool success, ) = fragment.fragseller.call{
			value: msg.value
		}("");
		require(success, "Transfer to seller failed");
		
	   
	
		// 将购买者地址设置为调用方法者
		fragment.fragbuyer = buyadd;
		// 将该碎片从可售状态设置为不可售
		fragment.isBuied = false;
		// 触发购买事件
		emit FragmentPurchased(tokenId, fragId, buyadd);
	}
    

	   function resellFragment(
        uint256 tokenId,
        uint256 fragId,
        uint256 newPrice,
		address fragbuyer
    ) external {
        // Ensure the fragment exists
        require(
            _tokenFragments[tokenId][fragId].fragId != 0,
            "Fragment does not exist"
        );

        Fragment storage fragment = _tokenFragments[tokenId][fragId];

        // Ensure the caller is the current buyer of the fragment
        require(fragment.fragbuyer == fragbuyer, "Only the buyer can resell");
		fragment.fragbuyer = address(0);
        fragment.fragseller = fragbuyer;
        // Mark the fragment as listed for resale
        fragment.isBuied = true;
        fragment.fragprice = newPrice; // Update the price

        
    }
     

	//获取所有碎片化的NFT
	function getAllFragmentsForToken(
		uint256 tokenId
	) public view returns (Fragment[] memory) {
		uint256[] memory fragIds = _tokenFragIds[tokenId];
		Fragment[] memory fragments = new Fragment[](fragIds.length);

		// Retrieve each fragment by fragId and return it
		for (uint i = 0; i < fragIds.length; i++) {
			fragments[i] = _tokenFragments[tokenId][fragIds[i]];
		}

		return fragments;
		
	}
}

// pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./console.sol";

// contract FragmentManager is Ownable {
//     struct NFTFragment {
//         uint256 tokenId;
//         address tokenSeller;
//         address tokenCreator;
//         bool isListedFragSale;
//         string tokenUri;
//     }

//     mapping(uint256 => NFTFragment) public nftFragment;

//     struct Fragment {
//         uint256 tokenId;
//         uint256 fragId;
//         uint256 fragprice;
//         address fragbuyer;
//         address fragseller;
//         address fragcreator;
//         bool isBuied;
//         string fragImageUri;
//     }

//     mapping(uint256 => mapping(uint256 => Fragment)) private _tokenFragments;
//     mapping(uint256 => uint256[]) private _tokenFragIds;



//     function _createFragmentizationNFT(
//         uint256 tokenId,
//         uint256 totalShares,
//         string[] memory imageUrls,
//         uint256 price,
//         address creator,
//         string memory tokenUri
//     ) internal {
//         require(totalShares > 0, "totalShares must be greater than 0");
//         require(imageUrls.length == totalShares, "Image URLs count must match the total shares");

//         for (uint256 i = 0; i < totalShares; i++) {
//             _tokenFragments[tokenId][i + 1] = Fragment({
//                 tokenId: tokenId,
//                 fragId: i + 1,
//                 fragprice: price,
//                 fragbuyer: address(0),
//                 fragseller: creator,
//                 fragcreator: creator,
//                 isBuied: true,
//                 fragImageUri: imageUrls[i]
//             });
//             _tokenFragIds[tokenId].push(i + 1);

//             nftFragment[tokenId] = NFTFragment({
//                 tokenId: tokenId,
//                 tokenSeller: creator,
//                 tokenCreator: creator,
//                 isListedFragSale: true,
//                 tokenUri: tokenUri
//             });

     
//         }
//     }

//     function _purchaseNFragmentft(
//         uint256 tokenId,
//         uint256 fragId,
//         uint256 amount,
//         address buyadd
//     ) internal {
//         require(_tokenFragments[tokenId][fragId].fragId != 0, "Fragment does not exist");
//         Fragment storage fragment = _tokenFragments[tokenId][fragId];
//         require(amount == fragment.fragprice, "Incorrect payment amount");
//         require(buyadd != fragment.fragseller, "Buyer cannot be the seller");

//         (bool success, ) = fragment.fragseller.call{value: amount}("");
//         require(success, "Transfer to seller failed");

//         fragment.fragbuyer = buyadd;
//         fragment.isBuied = false;
    
//     }

//     function _getAllFragmentsForToken(uint256 tokenId) internal view returns (Fragment[] memory) {
//         uint256[] memory fragIds = _tokenFragIds[tokenId];
//         Fragment[] memory fragments = new Fragment[](fragIds.length);

//         for (uint i = 0; i < fragIds.length; i++) {
//             fragments[i] = _tokenFragments[tokenId][fragIds[i]];
//         }

//         return fragments;
//     }
// }

