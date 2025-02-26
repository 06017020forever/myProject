

"use client";

import { useEffect, useState } from "react";
import { NFTCard } from "../page";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
interface RentalProps {
    address: `0x${string}`;  // Ensures address is correctly typed
  }
export interface Collectible extends Partial<NFTMetaData> {
  id: number;
  uri: string;
  owner: string;
}

export const RentalMark: React.FC<RentalProps> = ({ address }) => {
console.log("!!!!!", address)
  const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);





  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: myTotalBalance } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });


  useEffect(() => {
    const updateMyCollectibles = async (): Promise<void> => {
      if (myTotalBalance === undefined || yourCollectibleContract === undefined || address === undefined)
        return;

      setAllCollectiblesLoading(true);
      const collectibleUpdate: Collectible[] = [];
      const totalBalance = parseInt(myTotalBalance.toString());
      for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
        try {
          const tokenId = await yourCollectibleContract.read.tokenOfOwnerByIndex([
            address,
            BigInt(tokenIndex),
          ]);
         
        

          const tokenURI = await yourCollectibleContract.read.tokenURI([tokenId]);
          console.log(tokenURI);
          const nftMetadata: NFTMetaData = await getMetadataFromIPFS(tokenURI as string);
        console.log(nftMetadata)
   
            collectibleUpdate.push({
              id: parseInt(tokenId.toString()),
              uri: tokenURI,
              owner: address as `0x${string}`,
              ...nftMetadata,
            });

        } catch (e) {
          notification.error("Error fetching all collectibles");
          setAllCollectiblesLoading(false);
        }
      }
      collectibleUpdate.sort((a, b) => a.id - b.id);
      setMyAllCollectibles(collectibleUpdate);
      setAllCollectiblesLoading(false);
    };

    updateMyCollectibles();

  }, [address, myTotalBalance]);






  if (allCollectiblesLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
        {myAllCollectibles.length === 0 ? (
          <div className="text-center py-16">
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myAllCollectibles.map(item => (
              <div key={item.id} className="relative">
                <NFTCard nft={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    
      
  
    </div>
  );
};

