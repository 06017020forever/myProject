// import { useState, useEffect } from "react";
// import { OnSaleCollectible } from "../../marketPlace/page";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import {
//     ShoppingCartIcon ,
//   } from "@heroicons/react/24/outline";




// export const NFTCardMarket = ({ nft }: { nft: OnSaleCollectible }) => {

//     const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//     const priceInWei = parseEther(nft.price.toString());


//     const [nonce, setNonce] = useState(1);

//     const handlePurchase = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "purchaseNft",
//                 args: [BigInt(nft.tokenId)], // Wrap the BigInt in an array
//                 value: priceInWei,
//                 nonce: nonce 
//             });
//             setNonce(prevNonce => prevNonce + 1);
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//             setNonce(prevNonce => prevNonce + 1);
//         }


//     }


//     return (
//         <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
//             <figure className="relative">
//                 <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
//                 <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
//                     <span className="text-white"># {nft.tokenId}</span>
//                 </figcaption>
//             </figure>
//             <div className="card-body space-y-3">
//                 <div className="flex flex-col justify-center mt-1">
//                     <p className="my-0 text-lg">Name: {nft.name}</p>
//                     <div className="flex space-x-3 mt-1 items-center">
//                         {nft.attributes?.map((attr, index) => (
//                             <span key={index} className="text-lg font-semibold">
//                                 {attr.value}
//                             </span>
//                         ))}

//                     </div>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <p className="my-0 text-lg">Description: {nft.description}</p>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Owner:</span>
//                     <Address address={nft.seller as `0x${string}`} />
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">
//                         Price: {nft.price} ETH
//                     </span>
//                 </div>
//                 <div className="card-actions justify-end">
//                     <button
//                         className="btn btn-secondary btn-md px-20 tracking-wide"
//                         onClick={handlePurchase}
//                     >
//                         购买
//                     </button>
//                     <button
//                         className="btn btn-secondary btn-md px-7 tracking-wide flex items-center"
//                         onClick={handlePurchase}
//                     >
//                         <ShoppingCartIcon className="h-5 w-5 mr-1" />
//                         购物车
//                     </button>
//                 </div>

//             </div>


//         </div>
//     );
// };

// export default NFTCardMarket;


// import { useState } from "react";
// import { OnSaleCollectible } from "../../marketPlace/page";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { ShoppingCartIcon } from "@heroicons/react/24/outline";

// export const NFTCardMarket = ({ nft }: { nft: OnSaleCollectible }) => {
//     const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//     const priceInWei = parseEther(nft.price.toString());
//     const [nonce, setNonce] = useState(1);

//     const handlePurchase = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "purchaseNft",
//                 args: [BigInt(nft.tokenId)],
//                 value: priceInWei,
//                 nonce: nonce,
//             });
//             setNonce((prevNonce) => prevNonce + 1);
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//             setNonce((prevNonce) => prevNonce + 1);
//         }
//     };

//     const handleAddToCart = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "addToCart",
//                 args: [BigInt(nft.tokenId)],
//                 // nonce: nonce,
//             });
//             // setNonce((prevNonce) => prevNonce + 1);
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//             // setNonce((prevNonce) => prevNonce + 1);
//         }
//     };

//     return (
//         <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
//             <figure className="relative">
//                 <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
//                 <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
//                     <span className="text-white"># {nft.tokenId}</span>
//                 </figcaption>
//             </figure>
//             <div className="card-body space-y-3">
//                 <div className="flex flex-col justify-center mt-1">
//                     <p className="my-0 text-lg">Name: {nft.name}</p>
//                     <div className="flex space-x-3 mt-1 items-center">
//                         {nft.attributes?.map((attr, index) => (
//                             <span key={index} className="text-lg font-semibold">
//                                 {attr.value}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <p className="my-0 text-lg">Description: {nft.description}</p>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Owner:</span>
//                     <Address address={nft.seller as `0x${string}`} />
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Price: {nft.price} ETH</span>
//                 </div>
//                 <div className="card-actions justify-end flex space-x-2">
//                     <button
//                         className="btn btn-secondary btn-md px-20 tracking-wide"
//                         onClick={handlePurchase}
//                     >
//                         购买
//                     </button>
//                     <button
//                         className="btn btn-secondary btn-md px-4 tracking-wide flex items-center"
//                         onClick={handleAddToCart}
//                     >
//                         <ShoppingCartIcon className="h-5 w-5 mr-1" />

//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// import { useState } from "react";
// import { OnSaleCollectible } from "../../marketPlace/page";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { ShoppingCartIcon } from "@heroicons/react/24/outline";

// export const NFTCardMarket = ({ nft }: { nft: OnSaleCollectible }) => {
//     const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//     const priceInWei = parseEther(nft.price.toString());
//     const [nonce, setNonce] = useState(1);

//     const handlePurchase = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "purchaseNft",
//                 args: [BigInt(nft.tokenId)],
//                 value: priceInWei,
//                 nonce: nonce,
//             });
//             setNonce((prevNonce) => prevNonce + 1);
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//             setNonce((prevNonce) => prevNonce + 1);
//         }
//     };

//     const handleAddToCart = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "addToCart",
//                 args: [BigInt(nft.tokenId)],
//             });
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//         }
//     };

//     return (
//         <div className="card bg-base-100 shadow-lg w-[280px] h-[500px]  rounded-lg overflow-hidden group relative">

//             <figure className="relative">
//                 <img src={nft.image} alt="NFT Image" className="h-60 w-full object-cover" />
//                 <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
//                     <span className="text-white"># {nft.tokenId}</span>
//                 </figcaption>
//             </figure>


//             <div className="p-4">
//                 <div className="flex flex-col justify-center mt-1">
//                     <p className="my-0 text-lg">Name: {nft.name}</p>
//                     <div className="flex space-x-3 mt-1 items-center">
//                         {nft.attributes?.map((attr, index) => (
//                             <span key={index} className="text-lg font-semibold">
//                                 {attr.value}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <p className="my-0 text-lg">Description: {nft.description}</p>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Owner:</span>
//                     <Address address={nft.seller as `0x${string}`} />
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Price: {nft.price} ETH</span>
//                 </div>
//             </div>


//             <div className="flex absolute bottom-0 left-0 h-100 w-[100%] p-4  transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//                 <button
//                     className="btn bg-blue-500 text-white w-[80%] py-2 rounded-lg"
//                     onClick={handlePurchase}
//                 >
//                     Buy now
//                 </button>
//                 <button
//                     className="btn bg-gray-200 text-gray-700 w-[20%] flex justify-center items-center rounded-lg"
//                     onClick={handleAddToCart}
//                 >
//                     <ShoppingCartIcon className="h-5 w-5" />
//                 </button>
//             </div>
//         </div>

//     );
// };

// export default NFTCardMarket;

// import { useState } from "react";
// import { OnSaleCollectible } from "../../marketPlace/page";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { ShoppingCartIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";

// export const NFTCardMarket = ({ nft }: { nft: OnSaleCollectible }) => {
//     const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//     const priceInWei = parseEther(nft.price.toString());
//     const [nonce, setNonce] = useState(1);
//     const router = useRouter(); 


//     const handlePurchase = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "purchaseNft",
//                 args: [BigInt(nft.tokenId)],
//                 value: priceInWei,
//                 nonce: nonce,
//             });
//             setNonce((prevNonce) => prevNonce + 1);
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//             setNonce((prevNonce) => prevNonce + 1);
//         }
//     };

//     const handleAddToCart = async () => {
//         try {
//             await writeContractAsync({
//                 functionName: "addToCart",
//                 args: [BigInt(nft.tokenId)],
//             });
//         } catch (error) {
//             console.error("Error fetching NFTs:", error);
//         }
//     };


//     const handleCardClick = () => {
//         router.push(`/transfers/${nft.tokenId}`); 
//     };

//     return (
//         <div className="card bg-base-100 shadow-lg w-[280px] h-[470px] rounded-lg overflow-hidden group relative transform transition-transform duration-300 hover:scale-105"
//             onClick={handleCardClick} 
//         >


//             <figure className="relative overflow-hidden">
//                 <img src={nft.image} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
//             </figure>

//             <div className="p-4">
//                 <div className="flex flex-col justify-center mt-1">
//                     <p className="my-0 text-lg">Name: {nft.name}</p>
//                     <div className="flex space-x-3 mt-1 items-center">
//                         {nft.attributes?.map((attr, index) => (
//                             <span key={index} className="text-lg font-semibold">
//                                 {attr.value}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <p className="my-0 text-lg">Description: {nft.description}</p>
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Owner:</span>
//                     <Address address={nft.seller as `0x${string}`} />
//                 </div>
//                 <div className="flex space-x-3 mt-1 items-center">
//                     <span className="text-lg font-semibold">Price: {nft.price} ETH</span>
//                 </div>
//             </div>


//             <div className="flex absolute bottom-0 left-0  h-100 w-[100%] p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//                 <button
//                     className="btn bg-blue-500  hover:bg-blue-400 text-white w-[80%] py-2 rounded-lg"
//                     onClick={handlePurchase}
//                 >
//                     Buy now
//                 </button>
//                 <button
//                     className="btn bg-blue-500 hover:bg-blue-400 text-gray-700 w-[20%] flex justify-center items-center rounded-lg"
//                     onClick={handleAddToCart}
//                 >
//                     <ShoppingCartIcon className="h-7 w-7" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default NFTCardMarket;



import { useState, useRef, useEffect } from "react";
import { OnSaleCollectible } from "../../marketPlace/page";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
export const NFTCardMarket = ({ nft }: { nft: OnSaleCollectible }) => {
    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
    const priceInWei = parseEther(nft.price.toString());
    const router = useRouter();
    // const canvasRef = useRef<HTMLCanvasElement>(null);


    // useEffect(() => {
    //     if (!nft.image || !canvasRef.current) return;
    //     console.log(nft.image)
    //     const canvas = canvasRef.current;
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    //     const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    //     renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    //     const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    //     light.position.set(0, 20, 0);
    //     scene.add(light);

    //     const loader = new GLTFLoader();
    //     loader.load(
    //         nft.image,
    //       (gltf) => {
    //         const model = gltf.scene;
    //         scene.add(model);
    //         model.scale.set(0.3, 0.3, 0.3); // 将模型缩小到原来的 50%
    //         // Center the model
    //         const box = new THREE.Box3().setFromObject(model);
    //         const center = box.getCenter(new THREE.Vector3());
    //         model.position.sub(center);

    //         // Adjust camera to fit the model
    //         const size = box.getSize(new THREE.Vector3());
    //         const maxDim = Math.max(size.x, size.y, size.z);
    //         const fov = camera.fov * (Math.PI / 180);
    //         let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2)) * 6; // 调整摄像机距离
    //         camera.position.z = cameraZ;

    //         // Add orbit controls
    //         const controls = new OrbitControls(camera, renderer.domElement);
    //         controls.target.set(0, 0, 0);
    //         controls.update();

    //         // Animation loop
    //         function animate() {
    //           requestAnimationFrame(animate);
    //           controls.update();
    //           renderer.render(scene, camera);
    //         }
    //         animate();
    //       },
    //       undefined,
    //       (error) => console.error("Error loading model", error)
    //     );

    //     return () => {
    //       // Cleanup
    //       renderer.dispose();
    //       if (nft.image && typeof nft.image === 'string') {
    //         URL.revokeObjectURL(nft.image);
    //       }
    //     };
    //   }, [nft.image]);

    const { address: connectedAddress } = useAccount();

    const handlePurchase = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents the card click from being triggered
        try {
            console.log("Purchase button clicked for NFT with ID:");
            await writeContractAsync({
                functionName: "purchaseNft",
                args: [BigInt(nft.tokenId)],
                value: priceInWei,
            });

        } catch (error) {
            console.error("Error fetching NFTs:", error);
            // setNonce((prevNonce) => prevNonce + 1);
        }
    };


    const handleUnList = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents the card click from being triggered
        try {

            await writeContractAsync({
                functionName: "unlistNft",
                args: [BigInt(nft.tokenId)],
            });
            // setNonce((prevNonce) => prevNonce + 1);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            // setNonce((prevNonce) => prevNonce + 1);
        }
    };


    // const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.stopPropagation(); // Prevents the card click from being triggered
    //     try {
    //         await writeContractAsync({
    //             functionName: "addToCart",
    //             args: [BigInt(nft.tokenId)],
    //         });
    //     } catch (error) {
    //         console.error("Error fetching NFTs:", error);
    //     }
    // };

    const handleCardClick = () => {
        router.push(`/transfers/${nft.tokenId}`);
    };

    return (
        <div className="card bg-base-100 shadow-lg w-[280px] h-[470px] rounded-lg overflow-hidden group relative transform transition-transform duration-300 hover:scale-105"
            onClick={handleCardClick}
        >
            <figure className="relative overflow-hidden">
                {/* <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        /> */}
                <img src={nft.image} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </figure>





            <div className="p-4">
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
                    <span className="text-lg font-semibold">Price: {nft.price} ETH</span>
                </div>
            </div>
            <div className="flex absolute bottom-0 left-0 h-90 w-[100%] p-4 transform translate-y-full group-hover:translate-y-2.5 transition-transform duration-300">
                <button
                    className="btn bg-blue-500 hover:bg-blue-400 text-white w-[50%] py-2 rounded-lg"
                    onClick={handlePurchase}
                >
                    Purchase NFT
                </button>
                {connectedAddress === nft.seller && (
                    <button
                        className="btn bg-blue-500 hover:bg-blue-400 text-white w-[50%] py-2 rounded-lg"
                        onClick={handleUnList}
                    >
                        Unlist NFT
                    </button>
                )}

            </div>



        </div>
    );
};

export default NFTCardMarket;













{/* <button
                    className="btn bg-blue-500 hover:bg-blue-400 text-gray-700 w-[20%] flex justify-center items-center rounded-lg"
                    onClick={handleAddToCart}
                >
                    <ShoppingCartIcon className="h-7 w-7" />
                </button> */}