"use client";

// import type { NextPage } from "next";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

// const Transfers: NextPage = () => {
//   const { data: transferEvents, isLoading } = useScaffoldEventHistory({
//     contractName: "YourCollectible",
//     eventName: "Transfer",
//     // Specify the starting block number from which to read events, this is a bigint.
//     fromBlock: 0n,
//   });

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center mt-10">
//         <span className="loading loading-spinner loading-xl"></span>
//       </div>
//     );

//   return (
//     <>
//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center mb-8">
//             <span className="block text-4xl font-bold">All Transfers Events</span>
//           </h1>
//         </div>
//         <div className="overflow-x-auto shadow-lg">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th className="bg-primary">Token Id</th>
//                 <th className="bg-primary">From</th>
//                 <th className="bg-primary">To</th>
//               </tr>
//             </thead>
//             <tbody>
//               {!transferEvents || transferEvents.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} className="text-center">
//                     No events found
//                   </td>
//                 </tr>
//               ) : (
//                 transferEvents?.map((event, index) => {
//                   return (
//                     <tr key={index}>
//                       <th className="text-center">{event.args.tokenId?.toString()}</th>
//                       <td>
//                         <Address address={event.args.from} />
//                       </td>
//                       <td>
//                         <Address address={event.args.to} />
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };
// import { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { formatEther } from "viem";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

// const Transfers: NextPage = (props) => {
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({}); // 状态来存储元数据
//   const [loading, setLoading] = useState(true); // 加载状态

//   const { data: transactions } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getTokenTransactionHistory",
//     args: [BigInt(props.params.id)],
//   });

//   const { data: AloneNFTDetail } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getNftItem",
//     args: [BigInt(props.params.id)],
//   });




//   useEffect(() => {
//     const fetchMetadata = async () => {
//         try {
//           const fetchedMetadata =await getMetadataFromIPFS(AloneNFTDetail?.tokenUri as string);
//             setMetadata(fetchedMetadata);
//         } catch (error) {
//             console.error(`Error fetching metadata for tokenId ${AloneNFTDetail?.tokenId}:`, error);
//         } finally {
//             setLoading(false); // 更新加载状态
//         }
//     };

//     fetchMetadata();
// }, [AloneNFTDetail?.tokenUri]); // 依赖于 tokenUri，当它变化时重新获取
// if (loading) {
//     return <div>Loading...</div>; // 加载状态
// }

// console.log('dawdadadaa',metadata)

//   return (
//     <>




//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center mb-8">
//             <span className="block text-4xl font-bold">All Transfers Events for Token {props.params.id}</span>
//           </h1>
//         </div>
//         <div className="overflow-x-auto shadow-lg">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th className="bg-primary">Token Id</th>
//                 <th className="bg-primary">From</th>
//                 <th className="bg-primary">To</th>
//                 <th className="bg-primary">Price</th>
//                 <th className="bg-primary">Timestamp</th>
//                 <th className="bg-primary">royalty</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions && transactions.map((transfer, index) => (
//                 <tr key={index}>
//                   <td>{props.params.id}</td>
//                   <td><Address address={transfer.seller} /></td>
//                   <td><Address address={transfer.buyer} /></td>
//                   <td>{formatEther(transfer.price)} ETH</td>
//                   <td>{new Date(Number(transfer.timestamp) * 1000).toLocaleString()}</td>
//                   <td>{formatEther(transfer.royalty)} ETH</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Transfers;









// import { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { formatEther } from "viem";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

// const Transfers: NextPage = (props) => {
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
//   const [loading, setLoading] = useState(true);

//   const { data: transactions } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getTokenTransactionHistory",
//     args: [BigInt(props.params.id)],
//   });

//   const { data: AloneNFTDetail } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getNftItem",
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
//     fetchMetadata();
//   }, [AloneNFTDetail?.tokenUri]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto">
//       <div className="flex flex-col items-center">
//         <div className="bg-lightblue-100 p-6 rounded-lg text-center w-full md:w-3/4 lg:w-2/3">
//           <h2 className="text-3xl font-bold mb-4">NFT #{props.params.id} Details</h2>
//           <div className="flex flex-col md:flex-row items-center">
//             <img
//               src={metadata.image}
//               alt={metadata.name}
//               className="rounded-lg mb-4 w-64 h-64 object-cover"
//             />
//             <div className="md:ml-6 text-left">
//               <h3 className="text-2xl font-semibold">Name：{metadata.name}</h3>
//               <p className="text-2lg  font-semibold">Description：{metadata.description}</p>
//               <p className="text-lg font-semibold">
//                 Price: {formatEther(AloneNFTDetail?.price ?? BigInt(0))} ETH
//               </p>
//               <div className="text-lg mt-2 flex items-center">
//                 <span className="font-semibold mr-2">Seller:</span>
//                 <Address address={AloneNFTDetail?.seller} />
//               </div>

//               <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full mt-4">
//                 Purchase NFT
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col items-center mt-8">
//         <h3 className="text-2xl font-bold mb-4">历史交易记录</h3>
//         <div className="overflow-x-auto shadow-lg w-full md:w-3/4 lg:w-2/3">
//           <table className="table-auto w-full text-center">
//             <thead>
//               <tr>
//                 <th className="bg-blue-300 py-2 px-4">Token Id</th>
//                 <th className="bg-blue-300 py-2 px-4">From</th>
//                 <th className="bg-blue-300 py-2 px-4">To</th>
//                 <th className="bg-blue-300 py-2 px-4">Price</th>
//                 <th className="bg-blue-300 py-2 px-4">Timestamp</th>
//                 <th className="bg-blue-300 py-2 px-4">Royalty</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {transactions && transactions.map((transfer, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="py-2 px-4">{props.params.id}</td>
//                   <td className="py-2 px-4"><Address address={transfer.seller} /></td>
//                   <td className="py-2 px-4"><Address address={transfer.buyer} /></td>
//                   <td className="py-2 px-4">{formatEther(transfer.price)} ETH</td>
//                   <td className="py-2 px-4">{new Date(Number(transfer.timestamp) * 1000).toLocaleString()}</td>
//                   <td className="py-2 px-4">{formatEther(transfer.royalty)} ETH</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Transfers;




// import { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { formatEther } from "viem";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// // import { parseEther } from "viem";

// const Transfers: NextPage = (props) => {
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const [nonce, setNonce] = useState(1);


//   const { data: transactions } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getTokenTransactionHistory",
//     args: [BigInt(props.params.id)],
//   });

//   const { data: AloneNFTDetail } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getNftItem",
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
//     fetchMetadata();
//   }, [AloneNFTDetail?.tokenUri]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }
// // console.log(AloneNFTDetail?.price);

//   const handlePurchase = async () => {
//     try {
//       await writeContractAsync({
//         functionName: "purchaseNft",
//         args: [BigInt(props.params.id)],
//         value: AloneNFTDetail?.price,
//         nonce: 0,
//       });
//       // setNonce((prevNonce) => prevNonce + 1);
//     } catch (error) {
//       console.error("Error fetching NFTs:", error);
//       // setNonce((prevNonce) => prevNonce + 1);
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <div className="flex flex-col items-center">
//         <div className="bg-lightblue-100 p-6 rounded-lg text-center w-full md:w-3/4 lg:w-2/3">
//           <h2 className="text-3xl font-bold mb-4">NFT #{props.params.id} Details</h2>
//           <div className="flex flex-col md:flex-row items-center">
//             <img
//               src={metadata.image}
//               alt={metadata.name}
//               className="rounded-lg mb-4 w-64 h-64 object-cover cursor-pointer"
//               onClick={() => setModalOpen(true)} // Open modal on click
//             />
//             <div className="md:ml-6 text-left">
//               <h3 className="text-2xl font-semibold">Name: {metadata.name}</h3>
//               <p className="text-2lg font-semibold">Description: {metadata.description}</p>
//               <p className="text-lg font-semibold">
//                 Price: {formatEther(AloneNFTDetail?.price ?? BigInt(0))} ETH
//               </p>
//               <div className="text-lg mt-2 flex items-center">
//                 <span className="font-semibold mr-2">Seller:</span>
//                 <Address address={AloneNFTDetail?.seller} />
//               </div>
//               <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full mt-4"
//                 onClick={handlePurchase}

//               >

//                 Purchase NFT
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for enlarged image */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
//           <div className="relative">
//             <img
//               src={metadata.image}
//               alt={metadata.name}
//               className="rounded-lg w-full max-w-md h-auto"
//               onClick={() => setModalOpen(false)} // Close modal on click
//             />
//             <button
//               className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
//               onClick={() => setModalOpen(false)}
//             >
//               &times; {/* Close button */}
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col items-center mt-8">
//         <h3 className="text-2xl font-bold mb-4">历史交易记录</h3>
//         <div className="overflow-x-auto shadow-lg w-full md:w-3/4 lg:w-2/3">
//           <table className="table-auto w-full text-center">
//             <thead>
//               <tr>
//                 <th className="bg-blue-300 py-2 px-4">Token Id</th>
//                 <th className="bg-blue-300 py-2 px-4">From</th>
//                 <th className="bg-blue-300 py-2 px-4">To</th>
//                 <th className="bg-blue-300 py-2 px-4">Price</th>
//                 <th className="bg-blue-300 py-2 px-4">Timestamp</th>
//                 <th className="bg-blue-300 py-2 px-4">Royalty</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {transactions && transactions.map((transfer, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="py-2 px-4">{props.params.id}</td>
//                   <td className="py-2 px-4"><Address address={transfer.seller} /></td>
//                   <td className="py-2 px-4"><Address address={transfer.buyer} /></td>
//                   <td className="py-2 px-4">{formatEther(transfer.price)} ETH</td>
//                   <td className="py-2 px-4">{new Date(Number(transfer.timestamp) * 1000).toLocaleString()}</td>
//                   <td className="py-2 px-4">{formatEther(transfer.royalty)} ETH</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transfers;




"use client";

import { useState, useEffect,useRef } from "react";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTImage } from "../_components/NFTImage";
import { NFTStats } from "../_components/NFTStats";
import { CountdownTimer } from "../_components/CountdownTimer";
import { TransactionTabs } from "../_components/TransactionTabs";
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from "axios";  // Import axios for making API requests
const NFTDetails = (props: { params: { id: string } }) => {
  const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
  const [loading, setLoading] = useState(true);
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const [ethToUsd, setEthToUsd] = useState<number | null>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: transactions } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getTokenTransactionHistory",
    args: [BigInt(props.params.id)],
  });

  const { data: AloneNFTDetail } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getNftItem",
    args: [BigInt(props.params.id)],
  });


  // useEffect(() => {
  //   if (!metadata.image || !canvasRef.current) return;
  //   console.log(metadata.image)
  //   const canvas = canvasRef.current;
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  //   const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  //   renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  //   const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  //   light.position.set(0, 20, 0);
  //   scene.add(light);

  //   const loader = new GLTFLoader();
  //   loader.load(
  //     metadata.image,
  //     (gltf) => {
  //       const model = gltf.scene;
  //       scene.add(model);
  //       model.scale.set(0.3, 0.3, 0.3); // 将模型缩小到原来的 50%
  //       // Center the model
  //       const box = new THREE.Box3().setFromObject(model);
  //       const center = box.getCenter(new THREE.Vector3());
  //       model.position.sub(center);

  //       // Adjust camera to fit the model
  //       const size = box.getSize(new THREE.Vector3());
  //       const maxDim = Math.max(size.x, size.y, size.z);
  //       const fov = camera.fov * (Math.PI / 180);
  //       let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2)) * 6; // 调整摄像机距离
  //       camera.position.z = cameraZ;

  //       // Add orbit controls
  //       const controls = new OrbitControls(camera, renderer.domElement);
  //       controls.target.set(0, 0, 0);
  //       controls.update();

  //       // Animation loop
  //       function animate() {
  //         requestAnimationFrame(animate);
  //         controls.update();
  //         renderer.render(scene, camera);
  //       }
  //       animate();
  //     },
  //     undefined,
  //     (error) => console.error("Error loading model", error)
  //   );

  //   return () => {
  //     // Cleanup
  //     renderer.dispose();
  //     if (metadata.image && typeof metadata.image === 'string') {
  //       URL.revokeObjectURL(metadata.image);
  //     }
  //   };
  // }, [metadata.image]);



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
        setEthToUsd(response.data.ethereum.usd);  // Extracting the ETH to USD rate from the response
      } catch (error) {
        console.error("Error fetching ETH to USD rate:", error);
      }
    };

    fetchMetadata();

    fetchEthToUsdRate();
  }, [AloneNFTDetail?.tokenUri]);




  const handlePurchase = async () => {
    try {
      await writeContractAsync({
        functionName: "purchaseNft",
        args: [BigInt(props.params.id)],
        value: AloneNFTDetail?.price,
      });
    } catch (error) {
      console.error("Error purchasing NFT:", error);
    }
  };

  const handleMakeOffer = () => {
    // Implement make offer functionality
    console.log("Make offer clicked");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  const ethPrice = formatEther(AloneNFTDetail?.price ?? BigInt(0));
  const usdPrice = (Number(ethPrice) * ethToUsd!).toFixed(2);  // Convert ETH to USD


  return (
    <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link 
           href={`/collection/${AloneNFTDetail?.seller}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <NFTImage image={metadata.image || ""} name={metadata.name || ""} />
          {/* <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        /> */}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
          <NFTStats views={392} favorites={4} category="Art" />

          <div className="mt-6">
            <p className="text-sm text-gray-600">Sale ends October 26, 2024 at 3:11 PM</p>
            <CountdownTimer endDate="2024-12-26T15:24:00" />
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">Current price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-600">
                <a href={`https://www.coingecko.com/en/coins/ethereum`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {ethPrice} 
                </a>ETH
              </span>
              <span className="text-gray-600">
              $<a href={`https://www.investing.com/currencies/usd-cny-historical-data`} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  ({usdPrice})
                </a>
              </span>
            </div>
          </div>


          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePurchase}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
            >
              Buy now
            </button>
            <button
              onClick={handleMakeOffer}
              className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl"
            >
              Make offer
            </button>
          </div>

          <TransactionTabs transactions={[...(transactions || [])]} tokenId={props.params.id} />

        </div>
      </div>
    </div>
  );
};

export default NFTDetails;