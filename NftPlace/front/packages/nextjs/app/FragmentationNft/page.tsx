// "use client";

// import { useEffect, useState } from "react";
// import { ImageSlicePage } from "./_components/NFTFrag";


// import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { formatEther } from "viem";


// export interface OnSaleCollectible extends Partial<NFTMetaData> {
//   tokenId: string;
//   price: string;
//   seller: string;
//   isListed: boolean;
//   tokenURI: string;
// }

// export const Market = () => {
//   const [OnSaleCollectibles, setOnSaleCollectibles] = useState<OnSaleCollectible[]>([]);
//   const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);

//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });

//   const { data: OnSaleNfts } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAllListedNfts",
//     watch: true,
//   });

//   const fetchListedNfts = async (): Promise<void> => {
//     setAllCollectiblesLoading(true);
//     try {
//       const fetchedNfts: OnSaleCollectible[] = await Promise.all(
//         (OnSaleNfts || []).map(async (item: any) => {
//           const tokenId: string = item.tokenId.toString();
//           const priceInEth = formatEther(item.price);
//           const price: string = priceInEth.toString();
//           const seller: string = item.seller;
//           const isListed: boolean = item.isListed;
//           const tokenURI: string = item.tokenUri;
//           let metadata : Partial<NFTMetaData> = {};
//           try{
//             metadata = await getMetadataFromIPFS(tokenURI);
//           }catch(err){
//             console.error(`Error fetching metadata for tokenId ${tokenId}:`,err);
//             notification.error(`Error fetching metadata for tokenId ${tokenId}`)
//           }

//           return {
//             tokenId,
//             price,
//             seller,
//             isListed,
//             tokenURI, // Add tokenURI to match OnSaleCollectible
//             ...metadata,
//           };
//         })
//       );
//       setOnSaleCollectibles(fetchedNfts);
//     }catch (err) {
//       console.error("Error fetching NFTs:", err);
//       notification.error("Error fetching NFTs");
//     }finally{
//       setAllCollectiblesLoading(false);
//     }
//  };

//  useEffect(() =>{
//   if(!OnSaleNfts || !yourCollectibleContract) return
//   fetchListedNfts();
//  },[OnSaleNfts]);

//   if (allCollectiblesLoading)
//     return (
//       <div className="flex justify-center items-center mt-10">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );

//   return (
//     <>
//       {OnSaleCollectibles.length === 0 ? (
//         <div className="flex justify-center items-center mt-10">
//           <div className="text-2xl text-primary-content">No NFTs found</div>
//         </div>
//       ) : (
//         <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
//           {OnSaleCollectibles.map(nft => (
//             <ImageSlicePage nft={nft} key={nft.tokenId} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };
// export default Market;  



"use client";

import { useEffect, useState } from "react";
import { NFTCard } from "./_components/NFTFrag";
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

export const FragmentMark: React.FC<RentalProps> = ({ address }) => {

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
              <NFTCard nft={item}/>
              
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

