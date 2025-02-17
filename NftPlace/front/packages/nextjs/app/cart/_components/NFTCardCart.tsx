import { useState, useEffect } from "react";
import { CartCollectible } from "../../cart/page";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";


export const NFTCardCart = ({ nft }: { nft: CartCollectible }) => {

    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
    const priceInWei = parseEther(nft.price.toString());


    const [nonce, setNonce] = useState(1);

    const handlePurchase = async () => {
        try {
            await writeContractAsync({
                functionName: "purchaseNft",
                args: [BigInt(nft.tokenId)], // Wrap the BigInt in an array
                value: priceInWei,
                nonce: nonce 
            });
            setNonce(prevNonce => prevNonce + 1);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            setNonce(prevNonce => prevNonce + 1);
        }


    }


    return (
        <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
            <figure className="relative">
                <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
                <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
                    <span className="text-white"># {nft.tokenId}</span>
                </figcaption>
            </figure>
            <div className="card-body space-y-3">
                <div className="flex flex-col justify-center mt-1">
                    <p className="my-0 text-lg">Name: {nft.name}</p>
                    <div className="flex space-x-3 mt-1 items-center">
                        {nft.attributes?.map((attr, index) => (
                            <span key={index} className="text-lg font-semibold">
                                {attr.value}
                            </span>
                        ))}

                    </div>
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                    <p className="my-0 text-lg">Description: {nft.description}</p>
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                    <span className="text-lg font-semibold">Owner:</span>
                    <Address address={nft.seller as `0x${string}`} />
                </div>
                <div className="flex space-x-3 mt-1 items-center">
                    <span className="text-lg font-semibold">
                        Price: {nft.price} ETH
                    </span>
                </div>
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-secondary btn-md px-8 tracking-wide"
                        onClick={handlePurchase}
                    >
                        购买
                    </button>
                </div>
            </div>


        </div>
    );
};

export default NFTCardCart;
