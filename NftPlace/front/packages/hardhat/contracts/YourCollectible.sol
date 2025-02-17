//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./FragmentManager.sol";
import "./RentalManager.sol";
import "./MysteryBoxManager.sol";

contract YourCollectible is
	ERC721,
	ERC721Enumerable,
	ERC721URIStorage,
	Ownable,
	ERC721Royalty,
	ReentrancyGuard,
	RentalManager,
	MysteryBoxManager
{
	using Counters for Counters.Counter;
	FragmentManager public fragmentManager;
	Counters.Counter public tokenIdCounter;

	mapping(address => bool) hasDraw;

	bytes32 public merkleProofRoot;

	//每个NFT的版税信息
	struct Nftroyalty {
		address payable nftcreator;
		uint96 royalty;
	}

	uint256 public mysteryBoxPrice = 1 ether;

	// 存储每个tokenId的创作者地址
	mapping(uint256 => Nftroyalty) public _creators_nftRoyalties;

	// 累计的上架费用
	uint256 public totalFeesCollected;

	//NFT的信息
	struct NftItem {
		uint256 tokenId;
		uint256 price;
		address payable seller;
		bool isListed;
		string tokenUri;
	}

	//NFT交易记录的信息
	struct TransactionHistory {
		address seller;
		address buyer;
		uint256 price;
		uint256 timestamp;
		uint256 royalty;
	}

	// tokenId到_BididedTokenIds数组索引的映射
	mapping(uint256 => uint256) private _tokenIdToBidedIndex;

	// 维护所有竞拍的tokenId数组
	uint256[] private _bidTokenIds;
	

	// tokenId到_dropTokenIds数组索引的映射
	mapping(uint256 => uint256) private _tokenIdToDropdIndex;

	// 维护所有空投的tokenId数组
	uint256[] private _dropTokenIds;

	// Token ID到NftItem的映射
	mapping(uint256 => Auction) private _bidNftItem;

	//竞拍
	struct Auction {
		uint256 tokenId;
		uint256 minPrice;
		uint256 highestBid;
		address highestBidder;
		address bider;
		uint256 endTime;
		bool active;
		string tokenUri;
	}

	//每个NFT对应的交易记录
	mapping(uint256 => TransactionHistory[]) private tokenTransactionHistory; // 每个 tokenId 对应的交易历史记录

	// Token ID到NftItem的映射
	mapping(uint256 => NftItem) private _idToNftItem;

	// 确保每个tokenURI唯一
	mapping(string => bool) private _usedTokenURIs;

	// 维护所有上架的tokenId数组
	uint256[] private _listedTokenIds;

	// tokenId到_listedTokenIds数组索引的映射
	mapping(uint256 => uint256) private _tokenIdToListedIndex;

	// 上架费用比例（例如250代表2.5%）
	uint256 public listingFeePercentage = 100; // 1%
	uint256 public constant MAX_LISTING_FEE_PERCENTAGE = 500; // 最多5%

	// 事件
	event NftListed(
		uint256 indexed tokenId,
		address indexed seller,
		uint256 price
	);
	event NftUnlisted(uint256 indexed tokenId, address indexed seller);

	event NftPurchased(
		uint256 indexed tokenId,
		address indexed buyer,
		uint256 price
	);

	event FeesWithdrawn(address indexed owner, uint256 amount);
	event FeesReceived(address indexed sender, uint256 amount);

	event MysteryBoxBought(
		address indexed buyer,
		address indexed seller,
		uint256 tokenId
	);

	constructor(
		address _fragmentManagerAddress
	) ERC721("YourCollectible", "YCB") {
		fragmentManager = FragmentManager(_fragmentManagerAddress);
	}

	//拼接URI
	function _baseURI() internal pure override returns (string memory) {
		return "https://gateway.pinata.cloud/ipfs/";
	}

	function createRental(
		uint256 tokenId,
		uint256 rentPrice,
		// uint256 duration,
		uint256 cashPledge
	) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"You are not the owner of this NFT"
		);
		_createRental(tokenId, rentPrice, cashPledge, msg.sender);
	}

	function rentNFT(uint256 tokenId, uint256 duration) public payable {
		_rentNFT(tokenId, msg.sender, duration);
		_transfer(ownerOf(tokenId), msg.sender, tokenId);
	}

	function endRental(uint256 tokenId, uint256 currentTimes) public {
		_endRental(tokenId, currentTimes);
		_transfer(msg.sender, rentals[tokenId].rentaler, tokenId);
	}

	//创建竞拍
	function createAuction(
		uint256 tokenId,
		uint256 minPrice,
		uint256 duration
	) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner can initiate an auction"
		);
		require(
			!_bidNftItem[tokenId].active,
			"The NFT is already up for auction"
		);
		_bidNftItem[tokenId] = Auction({
			tokenId: tokenId,
			minPrice: minPrice,
			highestBid: 0,
			highestBidder: address(0),
			bider: msg.sender,
			endTime: block.timestamp + duration,
			active: true,
			tokenUri: tokenURI(tokenId)
		});

		_bidTokenIds.push(tokenId);
		_tokenIdToBidedIndex[tokenId] = _bidTokenIds.length - 1;
	}

	function bid(uint256 tokenId, uint256 extendTime) public payable {
		Auction storage bidNftItems = _bidNftItem[tokenId];
		require(bidNftItems.active, "This auction is inactive");
		require(block.timestamp < bidNftItems.endTime, "Auction has ended");
		require(
			msg.value > bidNftItems.highestBid,
			"Bid is lower than current maximum bid"
		);

		// 退还之前的最高出价者
		if (bidNftItems.highestBidder != address(0)) {
			payable(bidNftItems.highestBidder).transfer(bidNftItems.highestBid);
		}

		// 如果拍卖时间还剩10秒且有出价，则延长1分钟
		if (block.timestamp >= bidNftItems.endTime - 10 seconds) {
			bidNftItems.endTime += extendTime; // 延长拍卖时间
		}

		// 更新最高出价信息
		bidNftItems.highestBid = msg.value;
		bidNftItems.highestBidder = msg.sender;
	}

	// 结束拍卖并转移NFT
	function endAuction(uint256 tokenId, uint256 nowTimetamp) public {
		Auction storage bidNftItems = _bidNftItem[tokenId];
		require(bidNftItems.active, "Auction has ended");
		require(
			nowTimetamp >= bidNftItems.endTime,
			"The auction is not over yet"
		);
		bidNftItems.active = false;
		if (bidNftItems.highestBidder != address(0)) {
			// 如果有出价者，转移NFT并支付
			address highestBidder = bidNftItems.highestBidder;
			_bidNftItem[tokenId].highestBidder = address(0);
			bidNftItems.bider = address(0);

			_removeFromBided(tokenId);

			_transfer(ownerOf(tokenId), highestBidder, tokenId);
			payable(ownerOf(tokenId)).transfer(bidNftItems.highestBid); // 将资金转给卖家
		} else {
			// 如果没有出价者，重置拍卖时间和状态
			bidNftItems.endTime = 0;
		}
	}

	function buyMysteryBox(
		address seller
	) external payable nonReentrant returns (uint256) {
		require(msg.value == mysteryBoxPrice, "Please send exact amount");
		uint256 tokenId = _buyMysteryBox(msg.sender, seller, mysteryBoxPrice);
		NftItem storage item = _idToNftItem[tokenId];
		// 更新seller地址和价格
		item.seller = payable(address(0)); // 重置卖家信息在转账之后
		item.price = 0;
		_transfer(address(this), msg.sender, tokenId);

		// 触发事件，记录购买行为
		emit MysteryBoxBought(msg.sender, seller, tokenId);
		return tokenId;
	}

	// function addNftToMysteryBox(
	// 	uint256[] memory tokenIds,
	// 	uint96 royaltyFeeNumerator
	// ) public {
	// 	require(
	// 		ownerOf(tokenId) == msg.sender,
	// 		"You are not the owner of this NFT"
	// 	);
	// 	_transfer(msg.sender, address(this), tokenId);

	// 	if (msg.sender == _creators_nftRoyalties[tokenId].nftcreator) {
	// 		_setTokenRoyalty(tokenId, payable(msg.sender), royaltyFeeNumerator);
	// 	}
	// 	_setTokenRoyalty(tokenId, payable(msg.sender), royaltyFeeNumerator);
	// 	_addNftToMysteryBox(tokenId);

	// 	_idToNftItem[tokenId] = NftItem({
	// 		tokenId: tokenId,
	// 		price: mysteryBoxPrice,
	// 		seller: payable(msg.sender),
	// 		isListed: true,
	// 		tokenUri: tokenURI(tokenId)
	// 	});
	// }
	function addNftToMysteryBox(
		uint256[] memory tokenIds,
		uint96 royaltyFeeNumerator
	) public {
		// Iterate over each tokenId in the tokenIds array
		for (uint256 i = 0; i < tokenIds.length; i++) {
			uint256 tokenId = tokenIds[i];

			// Ensure that the caller is the owner of the NFT
			require(
				ownerOf(tokenId) == msg.sender,
				"You are not the owner of this NFT"
			);

			// Transfer the NFT to the contract (the mystery box)
			_transfer(msg.sender, address(this), tokenId);

			// Set the royalty for the token if the creator is the sender
			if (msg.sender == _creators_nftRoyalties[tokenId].nftcreator) {
				_setTokenRoyalty(
					tokenId,
					payable(msg.sender),
					royaltyFeeNumerator
				);
			}

			// Set the royalty for the token
			_setTokenRoyalty(tokenId, payable(msg.sender), royaltyFeeNumerator);

			// Add the tokenId to the mystery box
			_addNftToMysteryBox(tokenId);

			// Set the NFT details for the mystery box
			_idToNftItem[tokenId] = NftItem({
				tokenId: tokenId,
				price: mysteryBoxPrice,
				seller: payable(msg.sender),
				isListed: true,
				tokenUri: tokenURI(tokenId)
			});
		}
	}

	// // 设置盲盒价格
	function setMysteryBoxPrice(uint256 price) external onlyOwner {
		mysteryBoxPrice = price;
	}

	function createFragmentizationNFT(
		uint256 tokenId,
		uint256 totalShares,
		string[] memory imageUrls,
		uint256 price
	) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"You are not the owner of this NFT"
		);
		fragmentManager.createFragmentizationNFT(
			tokenId,
			totalShares,
			imageUrls,
			price,
			msg.sender,
			tokenURI(tokenId)
		);
	}

	function resellFragment(
		uint256 tokenId,
		uint256 fragId,
		uint256 newPrice
	) public payable {
		fragmentManager.resellFragment(tokenId, fragId, newPrice, msg.sender);
	}

	function purchaseNFragmentft(
		uint256 tokenId,
		uint256 fragId,
		address seller
	) public payable {
		fragmentManager.purchaseNFragmentft(
			tokenId,
			fragId,
			msg.value,
			msg.sender
		);
		payable(seller).transfer(msg.value); // 转移版税给创作者
	}

	//铸造新的NFT
	function mintItem(address to, string memory uri) public returns (uint256) {
		// require(!tokenURIExists(uri), "Token URI already exists");

		tokenIdCounter.increment();
		uint256 tokenId = tokenIdCounter.current();
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);

		// 拼接完整的 tokenURI
		string memory completeTokenURI = string(
			abi.encodePacked(_baseURI(), uri)
		);

		_idToNftItem[tokenId] = NftItem({
			tokenId: tokenId,
			price: 0,
			seller: payable(address(0)),
			isListed: false,
			tokenUri: completeTokenURI
		});
		Nftroyalty storage createRoyalty = _creators_nftRoyalties[tokenId];
		createRoyalty.nftcreator = payable(msg.sender); // Save the creator's address as payable

		emit NftUnlisted(tokenId, address(0)); // 或其他适当的事件

		return tokenId;
	}

	//批量铸造
	function mintBatch(
		string[] memory uris,
		uint256 quantity
	) public {
		require(
			uris.length == quantity,
			"URI length must be equal to quantity"
		);
		require(quantity > 0, "Quantity must be greater than 0");
		require(quantity <= 20, "Exceeded max batch size of 20");


		for (uint256 i = 0; i < quantity; i++) {
			tokenIdCounter.increment();
			uint256 tokenId = tokenIdCounter.current();
			_safeMint(msg.sender, tokenId);
			_setTokenURI(tokenId, uris[i]);
			// 拼接完整的 tokenURI
			string memory completeTokenURI = string(
				abi.encodePacked(_baseURI(), uris[i])
			);
			_idToNftItem[tokenId] = NftItem({
				tokenId: tokenId,
				price: 0,
				seller: payable(address(0)),
				isListed: false,
				tokenUri: completeTokenURI
			});

			Nftroyalty storage createRoyalty = _creators_nftRoyalties[tokenId];
			createRoyalty.nftcreator = payable(msg.sender); // Save the creator's address as payable
		
			_dropTokenIds.push(tokenId);
			_tokenIdToDropdIndex[tokenId] = _dropTokenIds.length - 1;
		}

	
	}

	//将NFT上架
	function placeNftOnSale(
		uint256 tokenId,
		uint256 price,
		uint96 royaltyFeeNumerator
	) external payable nonReentrant {
		require(price > 0, "Price must be at least 1 wei");
		require(
			ownerOf(tokenId) == msg.sender,
			"You are not the owner of this NFT"
		);
		require(!_idToNftItem[tokenId].isListed, "Item is already on sale");
		require(
			msg.value == calculateListingFee(price),
			"Incorrect listing fee"
		);

		// 将NFT转移到合约中进行托管
		_transfer(msg.sender, address(this), tokenId);
		// this.transferFrom(address(this), msg.sender, tokenId);

		// const uri = tokenURI(tokenId);

		// 更新NftItem信息
		if (msg.sender == _creators_nftRoyalties[tokenId].nftcreator)
			_setTokenRoyalty(tokenId, payable(msg.sender), royaltyFeeNumerator);
		_creators_nftRoyalties[tokenId].royalty = royaltyFeeNumerator;
		// 更新NftItem信息
		_idToNftItem[tokenId] = NftItem({
			tokenId: tokenId,
			price: price,
			seller: payable(msg.sender),
			isListed: true,
			tokenUri: tokenURI(tokenId)
		});

		// 将tokenId添加到listedTokenIds数组，并记录其索引
		_listedTokenIds.push(tokenId);
		_tokenIdToListedIndex[tokenId] = _listedTokenIds.length - 1;
		totalFeesCollected += msg.value;

		emit NftListed(tokenId, msg.sender, price);
	}

	//将NFT下架
	function unlistNft(uint256 tokenId) external nonReentrant {
		NftItem storage item = _idToNftItem[tokenId];
		require(item.isListed, "Item is not listed");
		require(item.seller == msg.sender, "You are not the seller");

		// 将NFT转回卖家
		// _transfer(address(this), msg.sender, tokenId);
		this.transferFrom(address(this), msg.sender, tokenId);

		// 重置NftItem信息
		item.isListed = false;
		item.price = 0;
		item.seller = payable(address(0));

		// 从listedTokenIds数组中移除tokenId
		_removeFromListed(tokenId);

		emit NftUnlisted(tokenId, msg.sender);
	}

	// 购买NFT
	function purchaseNft(uint256 tokenId) external payable nonReentrant {
		NftItem storage item = _idToNftItem[tokenId];
		Nftroyalty storage createRoyalty = _creators_nftRoyalties[tokenId];
		require(item.isListed, "Item is not listed for sale");
		require(
			item.price > 0,
			"The copyright has not yet been released for translation"
		);
		require(msg.value >= item.price, "Payment must be exactly the price");
		require(item.seller != msg.sender, "You are the seller");

		// 取消上架并更新状态
		item.isListed = false;
		address creator = createRoyalty.nftcreator;
		address payable seller = item.seller; // 记录卖家的地址
		uint256 sellerAmount;
		uint256 royaltyAmount;
		// address royaltyReceiver;

		// 检查卖家是否是创建者
		if (seller == creator) {
			// 如果卖家是创建者，全额转账给卖家
			sellerAmount = msg.value;
			royaltyAmount = 0;
		} else {
			// 如果卖家不是创建者，计算版税并分账
			(, royaltyAmount) = royaltyInfo(tokenId, msg.value);
			// royaltyAmount = (msg.value * createRoyalty.royalty) / 100; // 计算版税金额
			sellerAmount = msg.value - royaltyAmount; // 计算卖家应得的金额
			payable(creator).transfer(royaltyAmount); // 转移版税给创作者
		}

		// 记录交易历史
		tokenTransactionHistory[tokenId].push(
			TransactionHistory({
				seller: seller,
				buyer: msg.sender,
				price: msg.value,
				timestamp: block.timestamp,
				royalty: royaltyAmount
			})
		);

		// 更新seller地址和价格
		item.seller = payable(address(0)); // 重置卖家信息在转账之后
		item.price = 0;

		// 从listedTokenIds数组中移除tokenId
		_removeFromListed(tokenId);

		// // 将ETH转给卖家
		// (bool success, ) = seller.call{ value: msg.value }("");
		// require(success, "Transfer to seller failed");
		// 将ETH转给卖家
		(bool success, ) = seller.call{ value: sellerAmount }("");
		require(success, "Transfer to seller failed");

		// 将NFT转给买家
		// _transfer(address(this), msg.sender, tokenId);
		this.transferFrom(address(this), msg.sender, tokenId);

		emit NftPurchased(tokenId, msg.sender, item.price);
	}

	//修改竞拍时间
	function setBidTime(uint256 tokenId, uint256 nowTimetamp) external {
		Auction storage bidNftItems = _bidNftItem[tokenId];
		require(bidNftItems.active, "Auction has ended");

		require(
			nowTimetamp >= bidNftItems.endTime,
			"The auction is not over yet"
		);

		bidNftItems.active = false;
		if (bidNftItems.highestBidder == address(0)) {
			_bidNftItem[tokenId].highestBidder = address(0);
			bidNftItems.bider = address(0);
			bidNftItems.endTime = 0;
			_removeFromBided(tokenId);
		}
	}

	// 查询指定NFT的交易历史记录
	function getTokenTransactionHistory(
		uint256 tokenId
	) public view returns (TransactionHistory[] memory) {
		return tokenTransactionHistory[tokenId];
	}

	//获取NftItem信息
	function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
		return _idToNftItem[tokenId];
	}

	//获取NftItem信息Auction
	function getBidNftItem(
		uint256 tokenId
	) public view returns (Auction memory) {
		return _bidNftItem[tokenId];
	}

	//设置新的上架费用比例（仅合约所有者可调用）
	function setListingFeePercentage(
		uint256 _newListingFeePercentage
	) external onlyOwner {
		require(
			_newListingFeePercentage <= MAX_LISTING_FEE_PERCENTAGE,
			"Listing fee cannot exceed 10%"
		);
		listingFeePercentage = _newListingFeePercentage;
	}

	//获取当前上架的NFT数量
	function getListedItemsCount() external view returns (uint256) {
		return _listedTokenIds.length;
	}

	//从市场列表中移除tokenId
	function _removeFromDroped(uint256 tokenId) internal {
		uint256 index = _tokenIdToDropdIndex[tokenId];
		uint256 lastTokenId = _dropTokenIds[_dropTokenIds.length - 1];

		// 将要移除的tokenId与最后一个tokenId交换
		_dropTokenIds[index] = lastTokenId;
		_tokenIdToDropdIndex[lastTokenId] = index;

		// 删除最后一个元素
		_dropTokenIds.pop();

		// 删除映射中的条目
		delete _tokenIdToDropdIndex[tokenId];
	}

	function _removeFromListed(uint256 tokenId) internal {
		uint256 index = _tokenIdToListedIndex[tokenId];
		uint256 lastTokenId = _listedTokenIds[_listedTokenIds.length - 1];

		// 将要移除的tokenId与最后一个tokenId交换
		_listedTokenIds[index] = lastTokenId;
		_tokenIdToListedIndex[lastTokenId] = index;

		// 删除最后一个元素
		_listedTokenIds.pop();

		// 删除映射中的条目
		delete _tokenIdToListedIndex[tokenId];
	}

	//从竞拍列表中移除tokenId
	function _removeFromBided(uint256 tokenId) internal {
		uint256 index = _tokenIdToBidedIndex[tokenId];
		uint256 lastTokenId = _bidTokenIds[_bidTokenIds.length - 1];

		// 将要移除的tokenId与最后一个tokenId交换
		_bidTokenIds[index] = lastTokenId;
		_tokenIdToBidedIndex[lastTokenId] = index;

		// 删除最后一个元素
		_bidTokenIds.pop();

		// 删除映射中的条目
		delete _tokenIdToBidedIndex[tokenId];
	}

	//获取所有上架的NFT
	function getAllListedNfts() external view returns (NftItem[] memory) {
		uint256 totalListed = _listedTokenIds.length;
		NftItem[] memory items = new NftItem[](totalListed);
		for (uint256 i = 0; i < totalListed; i++) {
			uint256 tokenId = _listedTokenIds[i];
			items[i] = _idToNftItem[tokenId];
		}
		return items;
	}


	//获取所有上架的NFT
	function getAllDropTokenIds() external view returns (uint256[] memory) {
    return _dropTokenIds;
}

	// //获取盲盒的NFT信息
	function getAvailableTokens() external view returns (NftItem[] memory) {
		uint256 totalBlindNfts = availableTokens.length;
		NftItem[] memory items = new NftItem[](totalBlindNfts);
		for (uint256 i = 0; i < totalBlindNfts; i++) {
			uint256 tokenId = availableTokens[i];
			items[i] = _idToNftItem[tokenId];
		}
		return items;
	}

	//获取所有上竞拍的NFT
	function getAllBidedNfts() external view returns (Auction[] memory) {
		uint256 totalBided = _bidTokenIds.length;
		Auction[] memory items = new Auction[](totalBided);
		for (uint256 i = 0; i < totalBided; i++) {
			uint256 tokenId = _bidTokenIds[i];
			items[i] = _bidNftItem[tokenId];
		}
		return items;
	}

	//计算上架费用
	function calculateListingFee(
		uint256 priceInWei
	) public view returns (uint256) {
		uint256 fee = (priceInWei * listingFeePercentage) / 10000;
		return fee;
	}

	function setMerkleProofRoot(bytes32 _merkleProofRoot) external {
		merkleProofRoot = _merkleProofRoot;
	}

	//空投
	function drawAirDrop(
		uint256 tokenId,
		bytes32[] memory merkleProof,
		address airPublishAddress
	) external {
		require(!hasDraw[msg.sender], "You have already drawn the air drop");
		bytes32 leaf = keccak256(abi.encodePacked(msg.sender, tokenId));
		require(
			MerkleProof.verify(merkleProof, merkleProofRoot, leaf),
			"Invalid Merkle proof"
		);
		hasDraw[msg.sender] = true;

		_removeFromDroped(tokenId);
		_safeTransfer(airPublishAddress, msg.sender, tokenId, "");
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	function _burn(
		uint256 tokenId
	) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
		super._burn(tokenId);
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Royalty)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
