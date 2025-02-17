// "use client";

// import { useEffect, useState } from "react";
// import { NFTCard } from "./NFTCard";
// import { useAccount } from "wagmi";
// import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";

// export interface Collectible extends Partial<NFTMetaData> {
//   id: number;
//   uri: string;
//   owner: string;
// }

// export const MyHoldings = () => {
//   const { address: connectedAddress } = useAccount();
//   const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
//   const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);

//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });

//   const { data: myTotalBalance } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "balanceOf",
//     args: [connectedAddress],
//     watch: true,
//   });

//   useEffect(() => {
//     const updateMyCollectibles = async (): Promise<void> => {
//       if (myTotalBalance === undefined || yourCollectibleContract === undefined || connectedAddress === undefined)
//         return;

//       setAllCollectiblesLoading(true);
//       const collectibleUpdate: Collectible[] = [];
//       const totalBalance = parseInt(myTotalBalance.toString());
//       for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
//         try {
//           const tokenId = await yourCollectibleContract.read.tokenOfOwnerByIndex([
//             connectedAddress,
//             BigInt(tokenIndex),
//           ]);

//           const tokenURI = await yourCollectibleContract.read.tokenURI([tokenId]);
//           console.log("Token URI:", tokenURI.toString());
//           console.log(tokenURI);
//           // const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");

//           const nftMetadata: NFTMetaData = await getMetadataFromIPFS(tokenURI as string);

//           collectibleUpdate.push({
//             id: parseInt(tokenId.toString()),
//             uri: tokenURI,
//             owner: connectedAddress,
//             ...nftMetadata,
//           });
//         } catch (e) {
//           notification.error("Error fetching all collectibles");
//           setAllCollectiblesLoading(false);
//           console.log(e);
//         }
//       }
//       collectibleUpdate.sort((a, b) => a.id - b.id);
//       setMyAllCollectibles(collectibleUpdate);
//       setAllCollectiblesLoading(false);
//     };

//     updateMyCollectibles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [connectedAddress, myTotalBalance]);

//   if (allCollectiblesLoading)
//     return (
//       <div className="flex justify-center items-center mt-10">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );

//   return (
//     <>
//       {myAllCollectibles.length === 0 ? (
//         <div className="flex justify-center items-center mt-10">
//           <div className="text-2xl text-primary-content">No NFTs found</div>
//         </div>
//       ) : (
//         <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
//           {myAllCollectibles.map(item => (
//             <NFTCard nft={item} key={item.id} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// "use client";

// import { useEffect, useState } from "react";
// import { NFTCard } from "./NFTCard";
// import { useAccount } from "wagmi";
// import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";

// export interface Collectible extends Partial<NFTMetaData> {
//   id: number;
//   uri: string;
//   owner: string;
// }

// export const MyHoldings = () => {
//   const { address: connectedAddress } = useAccount();
//   const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
//   const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);
//   const [isBlindBoxMode, setIsBlindBoxMode] = useState(false); // 是否进入盲盒模式
//   const [selectedNFTs, setSelectedNFTs] = useState<number[]>([]); // 已选中的NFT tokenId
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });

//   const { data: myTotalBalance } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "balanceOf",
//     args: [connectedAddress],
//     watch: true,

//   });

//   useEffect(() => {
//     const updateMyCollectibles = async (): Promise<void> => {
//       if (myTotalBalance === undefined || yourCollectibleContract === undefined || connectedAddress === undefined)
//         return;

//       setAllCollectiblesLoading(true);
//       const collectibleUpdate: Collectible[] = [];
//       const totalBalance = parseInt(myTotalBalance.toString());
//       for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
//         try {
//           const tokenId = await yourCollectibleContract.read.tokenOfOwnerByIndex([
//             connectedAddress,
//             BigInt(tokenIndex),
//           ]);

//           const tokenURI = await yourCollectibleContract.read.tokenURI([tokenId]);
//           const nftMetadata: NFTMetaData = await getMetadataFromIPFS(tokenURI as string);

//           collectibleUpdate.push({
//             id: parseInt(tokenId.toString()),
//             uri: tokenURI,
//             owner: connectedAddress,
//             ...nftMetadata,
//           });
//         } catch (e) {
//           notification.error("Error fetching all collectibles");
//           setAllCollectiblesLoading(false);
//           // console.log(e);
//         }
//       }
//       collectibleUpdate.sort((a, b) => a.id - b.id);
//       setMyAllCollectibles(collectibleUpdate);
//       setAllCollectiblesLoading(false);
//     };

//     updateMyCollectibles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [connectedAddress, myTotalBalance]);

//   const handleToggleBlindBoxMode = () => {
//     setIsBlindBoxMode(!isBlindBoxMode);
//     setSelectedNFTs([]); // 重置已选NFT
//   };

//   const handleNFTSelection = (tokenId: number) => {
//     setSelectedNFTs(prev =>
//       prev.includes(tokenId) ? prev.filter(id => id !== tokenId) : [...prev, tokenId]
//     );
//   };

//   const handleConfirmJoin = async () => {
//     // 处理勾选的NFT tokenId
//     if (selectedNFTs.length > 0) {
//       // 这里可以将选中的NFT tokenId传递到合适的地方（比如发送到合约或者其他操作）
//       // console.log("Confirmed selected NFTs:", selectedNFTs[0]);
//       try {

//         await writeContractAsync({
//           functionName: "addNftToMysteryBox",
//           args: [BigInt(selectedNFTs[0]), BigInt(5)],

//         });

//         notification.success("Successfully confirmed selected NFTs!");
//       } catch (error) {
//         console.error("Error placing NFT on sale:", error);

//       }

//     } else {
//       notification.error("Please select at least one NFT to join.");
//     }
//   };

//   if (allCollectiblesLoading)
//     return (
//       <div className="flex justify-center items-center mt-10">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );

//   return (
//     <>
//       <div className="flex justify-end px-5 py-3">
//         <button
//           className="btn btn-primary"
//           onClick={handleToggleBlindBoxMode}
//         >
//           {isBlindBoxMode ? "取消" : "加入盲盒"}
//         </button>
//       </div>
//       {myAllCollectibles.length === 0 ? (
//         <div className="flex justify-center items-center mt-10">
//           {/* <div className="text-2xl text-primary-content">No NFTs found</div> */}
//         </div>
//       ) : (
//         <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
//           {myAllCollectibles.map(item => (
//             <div key={item.id} className="flex flex-col items-center">
//               <NFTCard nft={item} />
//               {isBlindBoxMode && (
//                 <div className="mt-10">
//                   <input
//                     type="checkbox"
//                     className="checkbox"
//                     checked={selectedNFTs.includes(item.id)}
//                     onChange={() => handleNFTSelection(item.id)}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       {isBlindBoxMode && selectedNFTs.length > 0 && (
//         <div className="fixed  bottom-80 right-5 bg-white p-3 rounded-lg shadow-md">
//           <h3 className="text-lg font-bold">已选NFT：</h3>
//           <ul>
//             {selectedNFTs.map(tokenId => (
//               <li key={tokenId}>Token ID: {tokenId}</li>
//             ))}
//           </ul>
//           <button
//             className="btn btn-success mt-3"
//             onClick={handleConfirmJoin}
//           >
//             确认加入
//           </button>
//         </div>
//       )}
//     </>
//   );
// };



"use client";
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react";
import { NFTCard } from "./NFTCard";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { LayoutGrid, List, Rows, Search } from 'lucide-react';
import { Address } from "~~/components/scaffold-eth";
import { useEnsAvatar, useEnsName } from "wagmi";
export interface Collectible extends Partial<NFTMetaData> {
  id: number;
  uri: string;
  owner: string;
}

export const MyHoldings = () => {
  const { address: connectedAddress } = useAccount();
  const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);
  const [isBlindBoxMode, setIsBlindBoxMode] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useState<number[]>([]);
  const [totalSupply, setTotalSupply] = useState(0); // 新增状态变量



  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: myTotalBalance } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
  });




  const { data: ensName } = useEnsName({
    address: connectedAddress,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || "", // Use the resolved ENS name or fallback to an empty string.
  });

  useEffect(() => {
    const updateMyCollectibles = async (): Promise<void> => {
      if (myTotalBalance === undefined || yourCollectibleContract === undefined || connectedAddress === undefined)
        return;

      setAllCollectiblesLoading(true);
      const collectibleUpdate: Collectible[] = [];
      const totalBalance = parseInt(myTotalBalance.toString());
      for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
        try {
          const tokenId = await yourCollectibleContract.read.tokenOfOwnerByIndex([
            connectedAddress,
            BigInt(tokenIndex),
          ]);
         
        

          const tokenURI = await yourCollectibleContract.read.tokenURI([tokenId]);
          console.log(tokenURI);
          const nftMetadata: NFTMetaData = await getMetadataFromIPFS(tokenURI as string);
        console.log(nftMetadata)
   
            collectibleUpdate.push({
              id: parseInt(tokenId.toString()),
              uri: tokenURI,
              owner: connectedAddress,
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
    setTotalSupply(Number(myTotalBalance))
  }, [connectedAddress, myTotalBalance]);

  const handleToggleBlindBoxMode = () => {
    setIsBlindBoxMode(!isBlindBoxMode);
    setSelectedNFTs([]);
  };

  const handleNFTSelection = (tokenId: number) => {
    setSelectedNFTs(prev =>
      prev.includes(tokenId) ? prev.filter(id => id !== tokenId) : [...prev, tokenId]
    );
  };

  const handleConfirmJoin = async () => {
    if (selectedNFTs.length > 0) {
      try {
        const bigIntSelectedNFTs = selectedNFTs.map((id) => BigInt(id));
        await writeContractAsync({
          functionName: "addNftToMysteryBox",
          args: [bigIntSelectedNFTs, BigInt(5)],
        });
        notification.success("Successfully confirmed selected NFTs!");
      } catch (error) {
        console.error("Error placing NFT on sale:", error);
      }
    } else {
      notification.error("Please select at least one NFT to join.");
    }
  };

  if (allCollectiblesLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link
          href="/CreateCollection"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </nav>

      {/* Profile Header */}
      <div className="mb-8">

        {/* <div className="w-32 h-32 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mb-4"></div> */}
        <div
          className="w-32 h-32 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mb-4"
          style={
            ensAvatar
              ? { backgroundImage: `url(${ensAvatar})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        ></div>
        {/* <h1 className="text-2xl font-bold mb-1">Unnamed</h1> */}
        <p className="text-gray-600 text-sm">  <Address address={connectedAddress as `0x${string}`} /></p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button className="px-1 py-4 text-sm font-medium text-gray-900 border-b-2 border-gray-900">Collected</button>
          {/* <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Offers made</button>
          <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Deals</button>
          <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Created</button>
          <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Favorited</button>
          <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Activity</button> */}
        </nav>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Status
            </button>
          </div>
          {/* <div className="relative">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Chains
            </button>
          </div> */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <List className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Rows className="h-5 w-5" />
          </button>
          <button
            onClick={handleToggleBlindBoxMode}
            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {isBlindBoxMode ? "Cancel" : "Join Blind Box"}
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm">NFTs: {totalSupply}</p>
      {/* NFT Grid */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
        {myAllCollectibles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items found for this search</h3>
            <button className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Back to all items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myAllCollectibles.map(item => (
              <div key={item.id} className="relative">
                <NFTCard nft={item} />
                {isBlindBoxMode && (
                  <div className="absolute top-4 right-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedNFTs.includes(item.id)}
                      onChange={() => handleNFTSelection(item.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Selected NFTs Panel */}
      {isBlindBoxMode && selectedNFTs.length > 0 && (
        <div className="fixed bottom-20 right-5 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Selected NFTs</h3>
          <ul className="space-y-2 mb-4">
            {selectedNFTs.map(tokenId => (
              <li key={tokenId} className="text-sm text-gray-600">Token ID: {tokenId}</li>
            ))}
          </ul>
          <button
            onClick={handleConfirmJoin}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Confirm Join
          </button>
        </div>
      )}
    </div>
  );
};

