
import { useState, useRef, useEffect } from "react";
import { TokenFragment } from "../[id]/page";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export const FragNFTCard = ({ nft }: { nft: TokenFragment }) => {
    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [showReModal, setReShowModal] = useState(false); // State to manage modal visibility
    const { address: connectedAddress } = useAccount();
    const [Price, setPrice] = useState(""); // Rent price state
    const closeModal = () => {
        setShowModal(false);
    };


    const handleNFT = async () => {
        setShowModal(true); // Show the modal
    };


    const closeReModal = () => {
        setReShowModal(false);
    };


    const handReNFT = async () => {
        setReShowModal(true); // Show the modal
    };


    const handlePurchase = async () => {

        await writeContractAsync({
            functionName: "purchaseNFragmentft",
            args: [BigInt(nft.tokenId), BigInt(nft.fragId), nft.fragseller as `0x${string}`],
            value: BigInt(parseEther(nft.fragprice)),
        });


        setShowModal(false); // Close the modal after the transaction
    };


    const handReOnsale = async () => {
        await writeContractAsync({
            functionName: "resellFragment",
            args: [BigInt(nft.tokenId), BigInt(nft.fragId), parseEther(Price)],
        });


        setReShowModal(false);
    };

    return (
        <div className="card bg-base-100 shadow-lg w-[250px] h-[400px] rounded-lg overflow-hidden group relative transform transition-transform duration-300 hover:scale-105">
            <figure className="relative overflow-hidden">
                <img src={nft.fragImageUri} alt="NFT Image" className="h-[100%] w-[90%] object-cover transition-transform duration-300 group-hover:scale-110" />
            </figure>
            <div className="p-4">

                <div className="flex space-x-3 mt-1 items-center">
                    <p className="my-0 text-lg">Price: {nft.fragprice} ETH</p>
                </div>

                <div className="flex space-x-3 mt-1 items-center">
                    <span className="text-lg font-semibold">购买者:</span>
                    <Address address={nft.fragbuyer as `0x${string}`} />
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                    <span className="text-lg font-semibold">售卖者</span>
                    <Address address={nft.fragseller as `0x${string}`} />
                </div>
            </div>
            <div className="flex absolute bottom-0 left-0 h-20 w-[100%] p-4 transform translate-y-full group-hover:translate-y-2.5 transition-transform duration-300">
                {/* <button
                    className="btn bg-blue-500 hover:bg-blue-400 text-white w-[50%] py-2 rounded-lg"
                    onClick={handleNFT}
                >
                    Purchase NFT
                </button> */}
                <button
                    className={`btn ${nft.isBuied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400"
                        } text-white w-[50%] py-2 rounded-lg`}
                    onClick={handleNFT}
                    disabled={nft.isBuied} // Disable the button if the NFT is already bought
                >
                    {nft.isBuied ? "Already Purchased" : "Purchase NFT"}
                </button>

                {/* <button
                    className="btn bg-blue-500 hover:bg-blue-400 text-white w-[50%] py-2 rounded-lg"
                    onClick={handleNFT}
                >
                    reOnsaleNFT
                </button> */}
                <button
                    className={`btn ${connectedAddress === nft.fragbuyer && !nft.isBuied // Check if connectedAddress is the seller and nft is not bought
                        ? "bg-blue-500 hover:bg-blue-400" // Show normal button style if conditions are met
                        : "bg-gray-400 cursor-not-allowed" // Disable the button if conditions are not met
                        } text-white w-[50%] py-2 rounded-lg`}
                    onClick={handReNFT}
                    disabled={connectedAddress !== nft.fragbuyer || nft.isBuied} // Disable button if conditions are not met
                >
                    {connectedAddress === nft.fragbuyer && !nft.isBuied
                        ? "Re-list NFT" // Show re-list option if conditions are met
                        : "Cannot re-list NFT"}
                </button>

            </div>

            {/* Modal for confirming rental */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h3 className="text-xl font-semibold mb-4">确认购买</h3>
                        <p className="mb-4 text-lg">总费用: {nft.fragprice} ETH</p>
                        <div className="flex justify-between">

                            <button
                                className="btn btn-secondary w-[45%]"
                                onClick={handlePurchase}
                            >
                                确认购买
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
            )}

            {/* {showReModal && (
                   <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="flex gap-4 mt-6">
                    <div className="mb-4">
                        <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
                        <input
                            type="number"
                            id="rentPrice"
                            className="input input-bordered w-full"
                            value={Price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handReOnsale}
                            className="flex bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
                        >
                            ReNft
                        </button>
                    </div>
                </div>
                </div>
            )} */}
            {showReModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[400px]">
                        <h3 className="text-xl font-semibold mb-4 text-center">Re-list NFT</h3>

                        {/* Rent Price Input */}
                        <div className="mb-4">
                            <label htmlFor="rentPrice" className="block mb-2 text-lg font-semibold">Price (ETH)</label>
                            <input
                                type="number"
                                id="rentPrice"
                                className="input input-bordered w-full"
                                placeholder="Enter price in ETH"
                                value={Price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0.01"  // Set a minimum value for ETH
                                step="0.01" // Ensure the input is decimal based
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                onClick={handReOnsale}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold disabled:bg-gray-300"
                                disabled={!Price || parseFloat(Price) <= 0} // Disable button if price is invalid
                            >
                                Re-list NFT
                            </button>
                            <button
                                onClick={closeReModal}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FragNFTCard;