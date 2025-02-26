// "use client";

// import { useEffect, useState } from "react";
// import { NFTCardMarket } from "./_components/NFTCardMarket";


// import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { formatEther } from "viem";

// interface MarketProps {
//   address: string;  // 声明 status 的类型
// }
// export interface OnSaleCollectible extends Partial<NFTMetaData> {
//   tokenId: string;
//   price: string;
//   seller: string;
//   isListed: boolean;
//   tokenURI: string;
// }

// export const Market: React.FC<MarketProps>  = ({ address }) => {

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
//         (OnSaleNfts || []).filter((item: any) => item.seller.toLowerCase() === address.toLowerCase()).map(async (item: any) => {
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
//         <div className="flex flex-wrap gap-4 my-8 px-5 justify">
//           {OnSaleCollectibles.map(nft => (
//             <NFTCardMarket nft={nft} key={nft.tokenId} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };
// export default Market;  

"use client";

import { useEffect, useState } from "react";
import { NFTCardMarket } from "./_components/NFTCardMarket";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { formatEther } from "viem";

interface MarketProps {
  address: string;
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: string;
  maxPrice?: string;
}

export interface OnSaleCollectible extends Partial<NFTMetaData> {
  tokenId: string;
  price: string;
  seller: string;
  isListed: boolean;
  tokenURI: string;
}

export const Market: React.FC<MarketProps> = ({ address, searchTerm = "", sortOrder = "asc", minPrice = "", maxPrice = "" }) => {
  const [OnSaleCollectibles, setOnSaleCollectibles] = useState<OnSaleCollectible[]>([]);
  const [filteredCollectibles, setFilteredCollectibles] = useState<OnSaleCollectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: OnSaleNfts } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getAllListedNfts",
    watch: true,
  });

  const fetchListedNfts = async (): Promise<void> => {
    setAllCollectiblesLoading(true);
    try {
      const fetchedNfts: OnSaleCollectible[] = await Promise.all(
        (OnSaleNfts || [])
          .filter((item: any) => item.seller.toLowerCase() === address.toLowerCase())
          .map(async (item: any) => {
            const tokenId: string = item.tokenId.toString();
            const priceInEth = formatEther(item.price);
            const price: string = priceInEth.toString();
            const seller: string = item.seller;
            const isListed: boolean = item.isListed;
            const tokenURI: string = item.tokenUri;
            let metadata: Partial<NFTMetaData> = {};
            try {
              metadata = await getMetadataFromIPFS(tokenURI);
            } catch (err) {
              console.error(`Error fetching metadata for tokenId ${tokenId}:`, err);
              notification.error(`Error fetching metadata for tokenId ${tokenId}`);
            }

            return {
              tokenId,
              price,
              seller,
              isListed,
              tokenURI,
              ...metadata,
            };
          }),
      );
      setOnSaleCollectibles(fetchedNfts);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      notification.error("Error fetching NFTs");
    } finally {
      setAllCollectiblesLoading(false);
    }
  };

  // Filter and sort NFTs based on search term, price range, and sort order
  useEffect(() => {
    let filtered = [...OnSaleCollectibles];

    // Apply search filter if search term exists
    if (searchTerm) {
      filtered = filtered.filter(
        nft =>
          nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply price range filter
    if (minPrice !== "" || maxPrice !== "") {
      filtered = filtered.filter(nft => {
        const price = parseFloat(nft.price);
        const min = minPrice !== "" ? parseFloat(minPrice) : Number.NEGATIVE_INFINITY;
        const max = maxPrice !== "" ? parseFloat(maxPrice) : Number.POSITIVE_INFINITY;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    setFilteredCollectibles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOrder, minPrice, maxPrice, OnSaleCollectibles]);

  useEffect(() => {
    if (!OnSaleNfts || !yourCollectibleContract) return;
    fetchListedNfts();
  }, [OnSaleNfts]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCollectibles.length / itemsPerPage);
  const currentItems = filteredCollectibles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (allCollectiblesLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <>
      {filteredCollectibles.length === 0 ? (
        <div className="flex justify-center items-center mt-10">
          <div className="text-2xl text-primary-content">No NFTs found</div>
        </div>
      ) : (
        <div className="space-y-1">
        <div className="flex flex-wrap gap-8 my-8 px-5 justify">
            {currentItems.map(nft => (
              <NFTCardMarket nft={nft} key={nft.tokenId} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 my-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#1F2937] text-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#1F2937] text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Market;

