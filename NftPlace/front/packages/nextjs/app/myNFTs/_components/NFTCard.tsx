

import { CountdownTimer } from "~~/app/transfers/_components/CountdownTimerCard";
import { useState, useEffect } from "react";
import { Collectible } from "../../myNFTs/_components/MyHoldings";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [listingFee, setListingFee] = useState("0");
  const [royaltyPercentage, setRoyaltyPercentage] = useState<null | string>(null);
  const [isCreator, setIsCreator] = useState(false); // Track if the user is the creator
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const { address: connectedAddress } = useAccount();
  const [auctionTime, setAuctionTime] = useState(""); // State for auction time
  const [minPrice, setMinPrice] = useState(""); // State for minimum price
  const [isAuctionEnded, setIsAuctionEnded] = useState(false)
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [reRentalModalOpen, setreRentalModalOpen] = useState(false);

  const [rentPrice, setRentPrice] = useState(""); // Rent price state
  const [duration, setDuration] = useState(""); // Duration state
  const [cashPledeg, setCashPledeg] = useState(""); // Cash pledge state
  const router = useRouter();

  const [totalCost, setTotalCost] = useState(0);


  // Fetch NFT item data
  const { data: nftItemData } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getNftItem",
    args: [BigInt(nft.id)],
  });

  const { data: bidNft } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getBidNftItem",
    args: [BigInt(nft.id)],
    watch: true,
  });

  const priceInWei = parseEther(salePrice.toString());
  const minPriceInWei = parseEther(minPrice.toString());
  // Fetch listing fee based on sale price
  const { data: Fee } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "calculateListingFee",
    args: [BigInt(priceInWei)],
  });

  // Fetch creator of NFT
  const { data: creator } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "_creators_nftRoyalties",
    args: [BigInt(nft.id)],
  });
  // console.log(creator?.[0]);

  // Fetch royalty percentage
  const { data: royaltyData } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "_creators_nftRoyalties",
    args: [BigInt(nft.id)],
  });



  const { data: rentalInformation } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "rentals",
    args: [BigInt(nft.id)],
  });

  // Calculate total cost based on duration and rental price per minute
  useEffect(() => {
    const rentalPricePerMinute = rentalInformation?.[2];
    if (rentalPricePerMinute !== undefined) {
      // Safely convert rentalPricePerMinute to BigInt (assuming it's in wei)
      const formattedPrice = formatEther(rentalPricePerMinute); // This assumes it's a BigInt
      setTotalCost(Number(formattedPrice) * Number(duration));
    } 
  }, [duration, rentalInformation]);


  useEffect(() => {
    if (royaltyData) {
      setRoyaltyPercentage(royaltyData?.[1].toString());
    }

    if (creator && creator?.[0] === connectedAddress) {
      setIsCreator(true); // User is the creator of this NFT
    } else {
      setIsCreator(false); // User is not the creator
    }
  }, [royaltyData, creator]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const feeValue = Fee ? BigInt(Fee) : BigInt(0);
      const adjustedFee = (feeValue / BigInt(1)).toString();
      setListingFee(adjustedFee || "0");
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [priceInWei, Fee]);


  useEffect(() => {
    if (bidNft?.active) {
      const checkAuctionEnd = () => {
        const now = new Date().getTime()
        const endTime = Number(bidNft.endTime) * 1000
        setIsAuctionEnded(now >= endTime)
      }

      checkAuctionEnd()
      const timer = setInterval(checkAuctionEnd, 1000)

      return () => clearInterval(timer)
    }
  }, [bidNft])


  const handlePlaceOnSale = async () => {
    try {

      if (royaltyPercentage === null) {
        console.error("Royalty percentage cannot be null");
        return;
      }

      const royaltyValue = BigInt(royaltyPercentage);

      const saleResponse = await writeContractAsync({
        functionName: "placeNftOnSale",
        args: [BigInt(nft.id), BigInt(priceInWei), royaltyValue],
        value: BigInt(listingFee),

      });

      if (!saleResponse) {
        console.error("Failed to place NFT on sale");
        return;
      }


      setIsModalOpen(false);
      setIsConfirmModalOpen(false);

    } catch (error) {
      console.error("Error placing NFT on sale:", error);

    }
  };



  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSalePrice("");
    setListingFee("0");
  };

  const handleConfirmModalOpen = () => {
    setIsConfirmModalOpen(true);
  };

  const handleRoyaltyPercentageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(1000, Math.max(0, parseInt(e.target.value || "0")));
    setRoyaltyPercentage(value.toString());
  };


  const handleAuctionModalOpen = () => {
    setIsAuctionModalOpen(true);
  };

  const handleAuctionSubmit = async () => {
    try {
      // Auction logic goes here
      const auctionTimeInSeconds = parseInt(auctionTime) * 60;
      const auctionResponse = await writeContractAsync({
        functionName: "createAuction",
        args: [BigInt(nft.id), minPriceInWei, BigInt(auctionTimeInSeconds)],
      });

      if (!auctionResponse) {
        console.error("Failed to start auction");
        return;
      }

      setIsAuctionModalOpen(false);
    } catch (error) {
      console.error("Error starting auction:", error);
    }
  };


  const handleSendNFT = async () => {
    try {
      const currentTime = Math.floor(Date.now() / 1000); // 获取当前时间戳（秒）
      const currentTimes = BigInt(currentTime);
      await writeContractAsync({
        functionName: "endAuction",
        args: [BigInt(nft.id), currentTimes],
      });
    } catch (error) {
      console.error("Error starting auction:", error);
    }


  };


  const handleDropNFT = async () => {
    try {
      const currentTime = Math.floor(Date.now() / 1000); // 获取当前时间戳（秒）
      const currentTimes = BigInt(currentTime);

      // 通过合约调用来检查拍卖状态，并在满足条件时重置竞拍
      await writeContractAsync({
        functionName: "setBidTime",
        args: [BigInt(nft.id), currentTimes],
      });
    } catch (error) {
      console.error("Error ending auction:", error);
    }

  };

  const { data: NftFragmentDetail } = useScaffoldReadContract({
    contractName: "FragmentManager",
    functionName: "nftFragment",
    args: [BigInt(nft.id)],
  });

  // Open Rental Modal
  const handreRentalModalOpen = () => {
    setreRentalModalOpen(true);
  };

  // Close Rental Modal
  const handreRentalModalClose = () => {
    setreRentalModalOpen(false);
  };

  // Open Rental Modal
  const handleRentalModalOpen = () => {
    setIsRentalModalOpen(true);
  };

  // Close Rental Modal
  const handleRentalModalClose = () => {
    setIsRentalModalOpen(false);
  };

  const createRental = async () => {
    try {
      // 通过合约调用来检查拍卖状态，并在满足条件时重置竞拍
      await writeContractAsync({
        functionName: "createRental",
        args: [BigInt(nft.id), // Token ID
        BigInt(parseEther(rentPrice)), // Rent price
        BigInt(parseEther(cashPledeg)),],
      });
      setIsRentalModalOpen(false); // Close modal after successful rental creation  
    } catch (error) {
      console.error("Error ending auction:", error);
    }

  };

  // Handle return NFT (返还)
  const handleReturnNFT = async () => {
    try {
      const currentTime = Math.floor(Date.now() / 1000); // 获取当前时间戳（秒）
      const currentTimes = BigInt(currentTime);
      // Call contract to return the NFT (assuming you have a function for this)
      await writeContractAsync({
        functionName: "endRental",
        args: [BigInt(nft.id), currentTimes], // Pass NFT ID to the contract
      });
      alert("NFT has been returned successfully!");
    } catch (error) {
      console.error("Error returning NFT:", error);
      alert("Failed to return NFT.");
    }
  };

  const confirmRental = async () => {
    const auctionTimeInSeconds = parseInt(duration) * 60;
    await writeContractAsync({
        functionName: "rentNFT",
        args: [BigInt(nft.id),BigInt(auctionTimeInSeconds)],
        value: BigInt(parseEther(String(totalCost))), // Pass the total fee (rent + deposit)
    });
    setreRentalModalOpen(false);
};


  const handleCardClick = () => {
    router.push(`/FragmentationNft/${nft.id}`);
  };




  return (
    <div className="card card-compact bg-base-100 shadow-lg w-[300px] h-[550px] shadow-secondary group relative overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105"

    >
      <figure className="relative">

        <img
          src={nft.image}
          alt="NFT Image"
          className="h-60 min-w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          onClick={handleCardClick}
        />
      </figure>

      <div className="card-body space-y-3">

        {/* Check if auction is active */}
        {bidNft?.active ? (

          // Auction Info
          <div className="mt-4">
            <div className="text-lg font-semibold">Auction Details:</div>
            <div className="flex flex-col justify-center mt-1">
              <p className="my-0 text-lg">最少出价: {formatEther(bidNft.minPrice)} ETH</p>
            </div>
            <div className="flex flex-col justify-center mt-1">
              <p className="my-0 text-lg">最高出价: {formatEther(bidNft.highestBid)} ETH</p>
            </div>
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-lg font-semibold">
                最高出价者: <Address address={bidNft.highestBidder as `0x${string}`} />
              </span>
            </div>
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-sm font-semibold">
                竞拍倒计时: <CountdownTimer endDate={new Date(Number(bidNft.endTime) * 1000).toLocaleString()} />
              </span>
            </div>
            <button
              className={`btn mt-4 w-[50%] ${isAuctionEnded ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} text-white py-2 rounded-lg transition-colors duration-200`}
              onClick={handleSendNFT}
              disabled={!isAuctionEnded}
            >
              {isAuctionEnded ? '发送 NFT' : '等待竞拍结束'}
            </button> <button
              className={`btn mt-4 w-70% ${isAuctionEnded ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} text-white py-2 rounded-lg transition-colors duration-200`}
              onClick={handleDropNFT}
              disabled={!isAuctionEnded}
            >
              {isAuctionEnded ? '下架竞拍' : '等待竞拍结束'}
            </button>
          </div>
        ) : (
          // Regular NFT Details when auction is not activeF
          <>
            {!rentalInformation?.[8] && !NftFragmentDetail?.[3] && (
              <>
                <div className="flex flex-col justify-center mt-1">
                  <p className="my-0 text-lg">Name: {nft.name}</p>
                </div>
                <div className="flex flex-col justify-center mt-1">
                  <p className="my-0 text-lg">Description: {nft.description}</p>
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                  <span className="text-lg font-semibold">
                    Price: {nftItemData?.price.toString()} ETH
                  </span>
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                  <span className="text-lg font-semibold">
                    上架状态: {nftItemData?.isListed ? '已上架' : '未上架'}
                  </span>
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                  <span className="text-lg font-semibold">Owner:</span>
                  <Address address={nft.owner as `0x${string}`} />
                </div>
              </>
            )}
          </>
        )}


        {NftFragmentDetail?.[3] && (
          <div className="mt-4">
            <div className="text-lg font-semibold"></div>
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-lg font-semibold">
                售卖人: <Address address={NftFragmentDetail?.[1] as `0x${string}`} />
              </span>
            </div>
            已被碎片化
          </div>
        )}



        {/* Rental Info when NFT is rented */}
        {rentalInformation?.[8] && (
          <div className="mt-4">
            <div className="text-lg font-semibold">租聘信息:</div>
            <div className="flex flex-col justify-center mt-1">
              <p className="my-0 text-lg">租金: {formatEther(rentalInformation?.[2])} ETH</p>
            </div>
            <div className="flex flex-col justify-center mt-1">
              <p className="my-0 text-lg">押金: {formatEther(rentalInformation?.[7])} ETH</p>
            </div>
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-lg font-semibold">
                出租人: <Address address={rentalInformation?.[6] as `0x${string}`} />
              </span>
            </div>
            {rentalInformation?.[3] !== 0n && (
              <div className="flex flex-col justify-center mt-1">
                <p className="my-0 text-lg">租赁开始时间: {new Date(Number(rentalInformation[3]) * 1000).toLocaleString()}</p>
              </div>
            )}

            {/* Conditionally render rental end time if it's not 0n */}
            {rentalInformation?.[5] !== 0n && (
              <div className="flex flex-col justify-center mt-1">
                <p className="my-0 text-lg">租赁结束时间: {new Date(Number(rentalInformation[5]) * 1000).toLocaleString()}</p>
              </div>
            )}
            <div className="flex space-x-3 mt-1 items-center">
              <span className="text-sm font-semibold">
                租聘计时: <CountdownTimer endDate={new Date(Number(rentalInformation?.[5]) * 1000).toLocaleString()} />
              </span>
            </div>

            {/* Conditional Button or Message */}
            {rentalInformation?.[6] !== connectedAddress ? (
              <div className="flex space-x-4">
                <button
                  className="btn mt-4 w-[50%] bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-200"
                  onClick={handleReturnNFT}
                >
                  返还 NFT
                </button>
                <button
                  className="btn mt-4 w-[50%] bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
                  onClick={handreRentalModalOpen}
                >
                  续租
                </button>
              </div>
            ) : (
              // If current user IS the rental owner, show a disabled button with a message
              <button
                className="btn mt-4 w-[100%] bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                disabled
              >
                已被出租
              </button>
            )}
          </div>

        )}


        {reRentalModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <div className="flex flex-col justify-center mt-1">
                <p className="my-0 text-lg">
                  总租金: {totalCost.toFixed(4)} ETH
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block mb-2 text-lg">续租天数</label>
                <input
                  type="number"
                  id="duration"
                  className="input input-bordered w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="btn bg-gray-500 text-white"
                  onClick={handreRentalModalClose}
                >
                  取消
                </button>
                <button
                  className="btn bg-blue-600 text-white"
                  onClick={confirmRental}
                >
                  确认续租
                </button>
              </div>
            </div>
          </div>
        )}



        <div className="flex absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {/* Display buttons only when auction is not active */}
          {!bidNft?.active && !rentalInformation?.[8] && !NftFragmentDetail?.[3] && (
            <>
              <button
                className="btn bg-blue-600 hover:bg-blue-500 text-white flex-1 py-2 rounded-lg transition-colors duration-200"
                onClick={handleOpenModal}
              >
                上架
              </button>
              <button
                className="btn bg-blue-600 hover:bg-blue-500 text-white flex-1 py-2 rounded-lg transition-colors duration-200"
                onClick={handleAuctionModalOpen} // Open auction modal
              >
                竞拍
              </button>
              <button
                className="btn bg-blue-600 hover:bg-blue-500 text-white flex-1 py-2 rounded-lg transition-colors duration-200"
                onClick={handleRentalModalOpen} // Open auction modal
              >
                出租
              </button>

            </>

          )}

        </div>


      </div>

      {isRentalModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-xl mb-4">Create Rental</h3>
            <div className="mb-4">
              <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
              <input
                type="number"
                id="rentPrice"
                className="input input-bordered w-full"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
              />
            </div>
            {/* <div className="mb-4">
              <label htmlFor="duration" className="block mb-2 text-lg">Duration (in days)</label>
              <input
                type="number"
                id="duration"
                className="input input-bordered w-full"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div> */}
            <div className="mb-4">
              <label htmlFor="cashPledeg" className="block mb-2 text-lg">Cash Pledge (ETH)</label>
              <input
                type="number"
                id="cashPledeg"
                className="input input-bordered w-full"
                value={cashPledeg}
                onChange={(e) => setCashPledeg(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="btn bg-gray-500 text-white"
                onClick={handleRentalModalClose}
              >
                取消
              </button>
              <button
                className="btn bg-blue-600 text-white"
                onClick={createRental}
              >
                确认出租
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Auction Modal */}
      {isAuctionModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-xl mb-4">Start Auction</h3>
            <div className="mb-4">
              <label htmlFor="auctionTime" className="block mb-2 text-lg">Auction Time (minutes)</label>
              <input
                type="number"
                id="auctionTime"
                className="input input-bordered w-full"
                value={auctionTime}
                onChange={(e) => setAuctionTime(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="minPrice" className="block mb-2 text-lg">Minimum Price (ETH)</label>
              <input
                type="number"
                id="minPrice"
                className="input input-bordered w-full"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="btn bg-gray-500 text-white"
                onClick={() => setIsAuctionModalOpen(false)}
              >
                取消
              </button>
              <button
                className="btn bg-blue-600 text-white"
                onClick={handleAuctionSubmit}
              >
                开始竞拍
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal for sale price input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box bg-white rounded-lg p-5">
            <h2 className="font-bold text-lg">上架 NFT</h2>
            <div className="mt-4">
              <label className="block mb-2">输入售价:</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">上架费用:</label>
              <div className="input w-full bg-gray-200 p-2 rounded">
                {listingFee !== undefined ? formatEther(BigInt(listingFee)) : 'N/A'} ETH
              </div>
            </div>
            {isCreator && (
              <div className="mt-4">
                <label className="block mb-2">版税百分比 (最多 10%):</label>
                <input
                  type="number"
                  value={royaltyPercentage || ""}
                  onChange={handleRoyaltyPercentageChange}
                  className="input w-full"
                  max={30}
                />
              </div>
            )}
            <div className="modal-action mt-4">
              <button className="btn" onClick={handleConfirmModalOpen}>
                确认上架
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for royalty confirmation */}
      {isConfirmModalOpen && royaltyPercentage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box bg-white rounded-lg p-5">
            <h2 className="font-bold text-lg">版税信息</h2>
            <p>本 NFT 版税为: {Number(royaltyPercentage) / 100}%</p>
            <div className="modal-action mt-4">
              <button className="btn" onClick={handlePlaceOnSale}>
                确定上架
              </button>
              <button className="btn" onClick={() => setIsConfirmModalOpen(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
