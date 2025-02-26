
import { CountdownTimer } from "~~/app/transfers/_components/CountdownTimerCard";
import { useState, useEffect } from "react";
import { Collectible } from "../myNFTs/_components/MyHoldings";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { formatEther } from "viem";


export const NFTCard = ({ nft }: { nft: Collectible }) => {

    const [bidAmount, setBidAmount] = useState("1");
    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
    const { data: rentalInformation } = useScaffoldReadContract({
        contractName: "YourCollectible",
        functionName: "rentals",
        args: [BigInt(nft.id)],
    });

    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [totalFee, setTotalFee] = useState<string>("0"); // State to store total fee

    if (!rentalInformation?.[8]) {
        return null; // Don't render the component if rentalInformation?.[8] is false or undefined
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const handleRentalNFT = async () => {
        const rentAmount = formatEther(rentalInformation?.[2]) || 0;
        const depositAmount = formatEther(rentalInformation?.[7]) || 0;

        const total = Number(rentAmount) + Number(depositAmount);
        setTotalFee(String(total)); // Set total fee in the modal state

        setShowModal(true); // Show the modal
    };


    const confirmRental = async () => {
        const auctionTimeInSeconds = parseInt(bidAmount) * 60;
        const { writeContractAsync } = useScaffoldWriteContract("YourCollectible"); //获取合约实例对象差不多这个意思
        await writeContractAsync({ //这是表示和合约方法交互得意思
            functionName: "rentNFT", //合约方法名字
            args: [BigInt(nft.id),BigInt(auctionTimeInSeconds)], //这个方法需要传的参数
            value: BigInt(parseEther(totalFee)), //调用者需要支付的钱
        });
        setShowModal(false); // Close the modal after the transaction
    };

    


    return (
        <div className="card card-compact bg-base-100 shadow-lg w-[300px] h-[500px] shadow-secondary group relative overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
            <figure className="relative">
                <img
                    src={nft.image}
                    alt="NFT Image"
                    className="h-60 min-w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
            </figure>
            <div className="mt-4">
                <div className="text-lg font-semibold">Auction Details:</div>
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

                <button
                    className={`btn mt-4 w-[100%] ${rentalInformation?.[1] ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} text-white py-2 rounded-lg transition-colors duration-200`}
                    onClick={handleRentalNFT}
                >
                    租聘
                </button>

            </div>


            {/* Modal for confirming rental */}
            {/* {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-xl font-semibold mb-4">确认租赁</h3>
                        <p className="mb-4 text-lg">总费用: {totalFee} ETH</p>
                        <input
                            type="number"
                            placeholder="Enter bid amount in ETH"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            step="0.01"
                        />
                        <div className="flex justify-between">

                            <button
                                className="btn btn-secondary w-[45%]"
                                onClick={confirmRental}
                            >
                                确认租赁
                            </button>
                            <button
                                className="btn btn-primary w-[45%]"
                                onClick={closeModal}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
{showModal && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-[320px] max-w-[90%] sm:w-[400px]">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">确认租赁</h3>
            <p className="text-lg text-gray-700 mb-6 text-center">总费用: <span className="font-bold text-green-500">{totalFee} ETH</span></p>
            <div className="mb-6">
                <input
                    type="number"
                    placeholder="Enter bid amount in ETH"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    min="1"
                    step="0.01"
                />
            </div>
            <div className="flex justify-between gap-4">
                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    onClick={confirmRental}
                >
                    确认租赁
                </button>
                <button
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
                    onClick={closeModal}
                >
                    取消
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};