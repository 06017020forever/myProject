

// "use client";
// import { ArrowLeft} from "lucide-react"
// import { useState, useEffect } from "react";
// import { formatEther } from "viem";
// import Link from "next/link"
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTImage } from "../../transfers/_components/NFTImage";
// import { NFTStats } from "../../transfers/_components/NFTStats";
// import { CountdownTimer } from "../../transfers/_components/CountdownTimer";

// import axios from "axios";  // Import axios for making API requests
// const NFTDetails = (props: { params: { id: string } }) => {
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
//   const [loading, setLoading] = useState(true);
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const [ethToUsd, setEthToUsd] = useState<number | null>(null);


//   const { data: AloneNFTDetail } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getBidNftItem",
//     args: [BigInt(props.params.id)],
//   });

//   useEffect(() => {
//     const fetchMetadata = async () => {
//       try {
//         const fetchedMetadata = await getMetadataFromIPFS(AloneNFTDetail?.tokenUri as string);
//         setMetadata(fetchedMetadata);
//       } catch (error) {
//         console.error(`Error fetching metadata for tokenId ${AloneNFTDetail?.tokenId}:`, error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     const fetchEthToUsdRate = async () => {
//       try {
//         const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
//         setEthToUsd(response.data.ethereum.usd);  // Extracting the ETH to USD rate from the response
//       } catch (error) {
//         console.error("Error fetching ETH to USD rate:", error);
//       }
//     };

//     fetchMetadata();

//     fetchEthToUsdRate();
//   }, [AloneNFTDetail?.tokenUri]);




//   const handlePurchase = async () => {
//     // try {
//     //   await writeContractAsync({
//     //     functionName: "purchaseNft",
//     //     args: [BigInt(props.params.id)],
//     //     value: AloneNFTDetail?.price,
//     //   });
//     // } catch (error) {
//     //   console.error("Error purchasing NFT:", error);
//     // }
//   };

//   const handleMakeOffer = () => {
//     // Implement make offer functionality
//     console.log("Make offer clicked");
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }


//   const ethPrice = formatEther(AloneNFTDetail?.minPrice ?? BigInt(0));
//   const usdPrice = (Number(ethPrice) * ethToUsd!).toFixed(2);  // Convert ETH to USD


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <nav className="mb-8">
//           <Link 
//            href={`/collection/${AloneNFTDetail?.bider}`}
//             className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//           </Link>
//         </nav>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div>
//           <NFTImage image={metadata.image || ""} name={metadata.name || ""} />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
//           <NFTStats views={392} favorites={4} category="Art" />

//           <div className="mt-6">
           
//             <CountdownTimer endDate={new Date(Number(AloneNFTDetail?.endTime) * 1000).toLocaleString()} />
//           </div>

//           <div className="mt-6">
//             <p className="text-sm text-gray-600">Current price</p>
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-bold text-gray-600">
//                 <a href={`https://www.coingecko.com/en/coins/ethereum`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//                   {ethPrice} 
//                 </a>ETH
//               </span>
//               <span className="text-gray-600">
//               $<a href={`https://www.investing.com/currencies/usd-cny-historical-data`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//                   ({usdPrice})
//                 </a>
//               </span>
//             </div>
//           </div>


//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={handlePurchase}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
//             >
//              出价
//             </button>
//           </div>



//         </div>
//       </div>
//     </div>
//   );
// };

// export default NFTDetails;
"use client";

import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import Link from "next/link";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTImage } from "../../transfers/_components/NFTImage";
import { NFTStats } from "../../transfers/_components/NFTStats";
import { CountdownTimer } from "../../transfers/_components/CountdownTimer";
import axios from "axios";
import { parseEther } from "viem";

const NFTDetails = (props: { params: { id: string } }) => {
  const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
  const [loading, setLoading] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const [ethToUsd, setEthToUsd] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState("1");

  const { data: AloneNFTDetail } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getBidNftItem",
    args: [BigInt(props.params.id)],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const fetchedMetadata = await getMetadataFromIPFS(AloneNFTDetail?.tokenUri as string);
        setMetadata(fetchedMetadata);
      } catch (error) {
        console.error(`Error fetching metadata for tokenId ${AloneNFTDetail?.tokenId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEthToUsdRate = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        setEthToUsd(response.data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH to USD rate:", error);
      }
    };

    fetchMetadata();
    fetchEthToUsdRate();
  }, [AloneNFTDetail?.tokenUri]);

  const handleBid = async () => {
    if (parseFloat(bidAmount) < 1) return;
    try {
      const remainingTime = Number(AloneNFTDetail?.endTime) * 1000 - Date.now();

      // 如果剩余时间少于10秒，则延长1分钟
      const extendTime = remainingTime < 10 * 1000 ? 1 * 60  : 0;
      console.log(extendTime)
      await writeContractAsync({
        functionName: "bid",
        args: [BigInt(props.params.id),BigInt(extendTime)],
        value: BigInt(parseEther(bidAmount)),
      });
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const minPrice = formatEther(AloneNFTDetail?.minPrice ?? BigInt(0));
  const usdMinPrice = (Number(minPrice) * (ethToUsd ?? 0)).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link
          href={`/collection/${AloneNFTDetail?.bider}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <NFTImage image={metadata.image || ""} name={metadata.name || ""} />
        
        </div>

        <div>
      
          <h1 className="text-4xl font-bold mb-4">Name：{metadata.name}</h1>
          {/* <div className="mt-6"> */}
            <h2 className="text-xl font-semibold mb-2">Description：{metadata.description}</h2>
            {/* <p className="text-gray-600">{metadata.description}</p> */}
          {/* </div> */}
          <NFTStats views={392} favorites={4} category="Art" />
          
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
         
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Auction ends in</span>
              <CountdownTimer endDate={new Date(Number(AloneNFTDetail?.endTime) * 1000).toLocaleString()} />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Minimum bid price</p>
              <p className="text-2xl font-bold text-gray-600"> <a href={`https://www.coingecko.com/en/coins/ethereum`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{minPrice}</a>ETH</p>
              <p className="text-sm text-gray-500">$<a href={`https://www.investing.com/currencies/usd-cny-historical-data`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{usdMinPrice}</a></p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Highest price</p>
              {formatEther(AloneNFTDetail?.highestBid ?? 0n)}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Highest bidder</p>
              <Address address={AloneNFTDetail?.highestBidder} />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Auction creator</p>
              <Address address={AloneNFTDetail?.bider} />
            </div>

            <div className="flex gap-4 mb-4">
              <input
                type="number"
                placeholder="Enter bid amount in ETH"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                step="0.01"
              />
            </div>

            <button
              onClick={handleBid}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
                parseFloat(bidAmount) >= 1
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={parseFloat(bidAmount) < 1}
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;

