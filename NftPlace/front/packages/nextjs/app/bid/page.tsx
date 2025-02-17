"use client";

import { useEffect, useState } from "react";
import { NFTCardBid } from "./_components/NFTCardBid";


import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { formatEther } from "viem";

interface BidProps {
  address: string;  // 声明 status 的类型
}
export interface OnBidCollectible extends Partial<NFTMetaData> {
  tokenId: string;
  minPrice: string;
  highestBid: string;
  highestBidder: string;
  bider: string;
  endTime: string;
  active: boolean;
  tokenURI: string;
}

export const BidMark: React.FC<BidProps> = ({ address }) => {
  const [OnBidCollectibles, setOnBidCollectibles] = useState<OnBidCollectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);
  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: OnBidNfts } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getAllBidedNfts",
    watch: true,
  });
console.log(OnBidNfts)
  const fetchBidedNfts = async (): Promise<void> => {
    setAllCollectiblesLoading(true);
    try {
      const fetchedNfts: OnBidCollectible[] = await Promise.all(
        (OnBidNfts || []).filter((item: any) => item.bider.toLowerCase() === address.toLowerCase()).map(async (item: any) => {
          const tokenId: string = item.tokenId.toString();
          const minPrice: string = formatEther(item.minPrice).toString();
          const highestBid: string = formatEther(item.highestBid).toString();
          const highestBidder: string = item.highestBidder;
          const bider: string = item.bider;
          const endTime: string = item.endTime;
          const active: boolean = item.active;
          const tokenURI: string = item.tokenUri;
          let metadata: Partial<NFTMetaData> = {};
          try {
            metadata = await getMetadataFromIPFS(tokenURI);
          } catch (err) {
            console.error(`Error fetching metadata for tokenId ${tokenId}:`, err);
            notification.error(`Error fetching metadata for tokenId ${tokenId}`)
          }

          return {
            tokenId,
            minPrice,
            highestBid,
            highestBidder,
            bider,
            endTime,
            active,
            tokenURI, // Add tokenURI to match OnSaleCollectible
            ...metadata,
          };
        })
      );
      console.log(fetchedNfts)
      setOnBidCollectibles(fetchedNfts);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      notification.error("Error fetching NFTs");
    } finally {
      setAllCollectiblesLoading(false);
    }
  };



  useEffect(() => {
    if (!OnBidNfts || !yourCollectibleContract) return
    fetchBidedNfts();
  }, [OnBidNfts]);


  if (allCollectiblesLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
console.log(OnBidCollectibles)
  return (
    <>
      {OnBidCollectibles.length === 0 ? (
        <div className="flex justify-center items-center mt-10">
          <div className="text-2xl text-primary-content">No NFTs found</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 my-8 px-5">
          {OnBidCollectibles.map(nft => (
            <NFTCardBid nft={nft} key={nft.tokenId} />
          ))}
        </div>
      )}
    </>
  );
};
export default BidMark;  