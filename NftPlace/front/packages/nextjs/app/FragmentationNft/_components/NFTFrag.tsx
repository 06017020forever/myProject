// import { parseEther } from "viem";
// import { formatEther } from "viem";
// import { useState, useEffect, useRef } from "react";
// import { notification } from "~~/utils/scaffold-eth";
// import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { useRouter } from "next/navigation";
// import FragNFTCard from "./FragNFTCard";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// export interface TokenFragment extends Partial<NFTMetaData> {
//   fragId: string;
//   fragprice: string;
//   fragbuyer: string;
//   fragseller: string;
//   fragcreator: string;
//   isListedFragSale: boolean;
//   fragImageUri: string;
// }

// export const ImageSlicePage = ({ nft }: { nft: any }) => {
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   // const tokenIdInputRef = useRef<HTMLInputElement>(null); // Correct type for input element
//   const shardCountInputRef = useRef<HTMLInputElement>(null); // Correct type for input element
//   const [img, setImg] = useState<HTMLImageElement | null>(null);
//   const [ImageUrisSlices, setImageUriSlices] = useState<string[]>([]);
//   const [reconstructedImageSrc, setReconstructedImageSrc] = useState<string | null>(null);
//   const [isSlicedView, setIsSlicedView] = useState<boolean>(false);
//   const [shardCount, setShardCount] = useState<number>();
//   const [FragmentCollectibles, setFragmentCollectibles] = useState<TokenFragment[]>([]);
//   const [Price, setPrice] = useState(""); // Rent price state

//   const router = useRouter();

//   const rows = shardCount ? Math.ceil(Math.sqrt(shardCount)) : 0;
//   const cols = shardCount ? Math.ceil(shardCount / rows) : 0;

//   const padding = 5;

//   // Pinata configuration
//   const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

//   // Fetch fragment URLs from the contract after storing
//   const { data: tokenFragmentsUrl } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAllFragmentsForToken",
//     args: [BigInt(nft.tokenId)],
//   });




//   const fetchListedNfts = async (): Promise<void> => {

//     try {
//       const fetchedNfts: TokenFragment[] = await Promise.all(
//         (tokenFragmentsUrl || []).map(async (item: any) => {
//           const fragId: string = item.fragId.toString();
//           const fragprice = formatEther(item.fragprice);
//           const fragbuyer: string = item.fragbuyer;
//           const fragseller: string = item.fragseller;
//           const fragcreator: string = item.fragcreator;
//           const isListedFragSale: boolean = item.isListedFragSale;
//           const fragImageUri: string = item.fragImageUri;

//           return {
//             fragId,
//             fragprice,
//             fragbuyer,
//             fragseller,
//             fragcreator,
//             isListedFragSale,
//             fragImageUri,

//           };
//         })
//       );
//       setFragmentCollectibles(fetchedNfts);
//     } catch (err) {
//       console.error("Error fetching NFTs:", err);
//       notification.error("Error fetching NFTs");
//     }
//   };




//   useEffect(() => {
//     if (tokenFragmentsUrl && Array.isArray(tokenFragmentsUrl)) {
//       const fragImageUris = tokenFragmentsUrl.map((fragment: any) => fragment.fragImageUri);
//       console.log(fragImageUris);
//       // setImageUriSlices(fragImageUris);
//       setShardCount(fragImageUris.length)
//       fetchListedNfts();
//       reconstructImage(fragImageUris, fragImageUris.length); // Reconstruct image from contract fragments
//     }
//   }, [tokenFragmentsUrl]);


//   useEffect(() => {

//     if (nft.image) {

//       const imgElement = new Image();
//       imgElement.crossOrigin = "Anonymous";
//       imgElement.src = nft.image;
//       imgElement.onload = () => setImg(imgElement);

//     }
//   }, [nft.image]);


//   // // Slice the image
//   // const sliceImage = async(imgElement: HTMLImageElement, fragCount: number) => {
//   //     const rows = Math.ceil(Math.sqrt(fragCount));
//   //     const cols = Math.ceil(fragCount / rows);

//   //     const imgWidth = imgElement.width;
//   //     const imgHeight = imgElement.height;
//   //     const sliceWidth = imgWidth / cols- padding;
//   //     const sliceHeight = imgHeight / rows- padding;

//   //     const sliceArray: string[] = [];

//   //     for (let row = 0; row < rows; row++) {
//   //         for (let col = 0; col < cols; col++) {
//   //             const sx = col * (imgWidth / cols);
//   //             const sy = row * (imgHeight / rows);
//   //             const sWidth = imgWidth / cols;
//   //             const sHeight = imgHeight / rows;


//   //             const canvas = document.createElement("canvas");
//   //             const ctx = canvas.getContext("2d");
//   //             if (ctx) {
//   //                 canvas.width = sliceWidth + padding;
//   //                 canvas.height = sliceHeight + padding;

//   //                 ctx.drawImage(
//   //                   imgElement,
//   //                   sx,
//   //                   sy,
//   //                   sWidth,
//   //                   sHeight,
//   //                   padding / 2,
//   //                   padding / 2,
//   //                   sliceWidth,
//   //                   sliceHeight
//   //                 );

//   //                 const dataUrl = canvas.toDataURL();
//   //                 // console.log("打印dataUrl",dataUrl)
//   //                 // console.log(`Slice ${row * cols + col}: ${dataUrl}`);  // Print the data URL of each slice
//   //                 sliceArray.push(dataUrl);


//   //               }
//   //         }
//   //     }
//   // const uploadedUrls = await uploadSlicesToPinata(sliceArray);
//   // setSlices(uploadedUrls); // Update slices state with uploaded URLs

//   // };
//   const sliceImage = async (imgElement: HTMLImageElement, fragCount: number): Promise<string[]> => {
//     const rows = Math.ceil(Math.sqrt(fragCount));
//     const cols = Math.ceil(fragCount / rows);

//     const imgWidth = imgElement.width;
//     const imgHeight = imgElement.height;
//     const sliceWidth = imgWidth / cols - padding;
//     const sliceHeight = imgHeight / rows - padding;

//     const sliceArray: string[] = [];

//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < cols; col++) {
//         const sx = col * (imgWidth / cols);
//         const sy = row * (imgHeight / rows);
//         const sWidth = imgWidth / cols;
//         const sHeight = imgHeight / rows;

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           canvas.width = sliceWidth + padding;
//           canvas.height = sliceHeight + padding;

//           ctx.drawImage(
//             imgElement,
//             sx,
//             sy,
//             sWidth,
//             sHeight,
//             padding / 2,
//             padding / 2,
//             sliceWidth,
//             sliceHeight
//           );

//           const dataUrl = canvas.toDataURL();
//           sliceArray.push(dataUrl);
//         }
//       }
//     }

//     // Upload slices and return the URLs
//     const uploadedUrls = await uploadSlicesToPinata(sliceArray);
//     return uploadedUrls; // Return the uploaded URLs
//   };


//   // Upload the slices to Pinata and return the URLs
//   const uploadSlicesToPinata = async (slices: string[]): Promise<string[]> => {

//     const uploadedUrls: string[] = [];

//     for (const slice of slices) {
//       const formData = new FormData();
//       const blob = await fetch(slice).then(res => res.blob()); // Convert base64 to Blob
//       formData.append("file", blob, "slice.png");

//       try {
//         const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${pinataJWT}`,
//           },
//           body: formData,
//         });

//         const data = await response.json();
//         if (data.IpfsHash) {
//           const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//           uploadedUrls.push(imageUrl); // Store the URL of the uploaded slice
//         } else {
//           console.error("Error uploading slice:", slice);
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }

//     return uploadedUrls;
//   };




//   // Reconstruct the image from its slices
//   // const reconstructImage = (sliceArray: string[],fragCount:number) => {
//   //   const rows = Math.ceil(Math.sqrt(fragCount));
//   //   const cols = Math.ceil(fragCount / rows);
//   //   const imgWidth = img?.width || 0;
//   //   const imgHeight = img?.height || 0;
//   //   const sliceWidth = imgWidth / cols;
//   //   const sliceHeight = imgHeight / rows;

//   //   const canvas = document.createElement("canvas");
//   //   const ctx = canvas.getContext("2d");

//   //   if (ctx) {
//   //     canvas.width = imgWidth;
//   //     canvas.height = imgHeight;

//   //     sliceArray.forEach((slice, index) => {
//   //       const row = Math.floor(index / cols);
//   //       const col = index % cols;

//   //       const x = col * sliceWidth;
//   //       const y = row * sliceHeight;

//   //       const img = new Image();
//   //       img.src = slice;

//   //       img.onload = () => {
//   //         ctx.drawImage(img, x, y);
//   //         if (index === sliceArray.length - 1) {
//   //           setReconstructedImageSrc(canvas.toDataURL());
//   //          console.log(canvas.toDataURL())
//   //         }
//   //       };
//   //     });
//   //   }
//   // };

//   const reconstructImage = (sliceArray: string[], fragCount: number) => {
//     // Calculate rows and columns based on the number of fragments
//     const rows = Math.ceil(Math.sqrt(fragCount));
//     const cols = Math.ceil(fragCount / rows);

//     // Create a canvas to reconstruct the image
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     if (!ctx) return;

//     // Set canvas dimensions based on the number of fragments
//     const imgWidth = 500; // You can set a default width, or dynamically fetch it if known
//     const imgHeight = 500; // You can set a default height, or dynamically fetch it if known
//     const sliceWidth = imgWidth / cols;
//     const sliceHeight = imgHeight / rows;

//     // Set canvas size to the original image dimensions
//     canvas.width = imgWidth;
//     canvas.height = imgHeight;

//     // Track the number of loaded images
//     let loadedImages = 0;

//     // Iterate over each slice in the sliceArray
//     sliceArray.forEach((slice, index) => {
//       const row = Math.floor(index / cols); // Determine the row for the current slice
//       const col = index % cols; // Determine the column for the current slice

//       const x = col * sliceWidth;
//       const y = row * sliceHeight;

//       const img = new Image();
//       img.src = slice; // Set image source to the base64 or IPFS URL

//       // Set cross-origin attribute to allow canvas export
//       img.crossOrigin = "Anonymous";

//       // Once the image is loaded, draw it on the canvas
//       img.onload = () => {
//         ctx.drawImage(img, x, y, sliceWidth, sliceHeight);

//         // Check if all images have been loaded to finalize the reconstruction
//         loadedImages += 1;
//         if (loadedImages === sliceArray.length) {
//           try {
//             const dataURL = canvas.toDataURL(); // Convert canvas to Data URL (base64)
//             setReconstructedImageSrc(dataURL); // Set the final reconstructed image source
//             console.log(dataURL); // Optionally log the data URL for debugging
//           } catch (error) {
//             console.error("Error converting canvas to dataURL:", error);
//           }
//         }
//       };

//       // Handle image loading errors
//       img.onerror = () => {
//         console.error("Failed to load image:", slice);
//       };
//     });
//   };



//   const handleActionButtonClick = async () => {
//     // const tokenId = tokenIdInputRef.current?.value; // Use optional chaining to avoid undefined errors
//     const shardCount = shardCountInputRef.current?.value; // Use optional chaining
//     console.log("片数", shardCount)


//     if (!img) {
//       notification.error("Image not loaded.");
//       return;
//     }
//     const fragmentUrls = await sliceImage(img, Number(shardCount));// Use the sliced URLs to store in contract
//     console.log("长度", fragmentUrls.length)
//     console.log("长度", fragmentUrls)

//     try {
//       //   await writeContractAsync({
//       //     functionName: "createFragmentizationNFT",
//       //     args: [BigInt(nft.tokenId), BigInt(Number(shardCount)), fragmentUrls,parseEther(Price)],
//       // });

//       notification.success("NFT fragments created successfully!");

//     } catch (error) {
//       notification.error("Failed to create NFT fragments.");
//     }
//   };

//   const toggleView = () => setIsSlicedView(!isSlicedView);

//   return (
//     <div className="flex">
//       {/* Left side: Image display */}
//       <div className="flex-grow">
//         {nft.image && img && (
//           <div>
//             <button onClick={toggleView} className="btn btn-secondary mb-4">
//               {isSlicedView ? "Show Original" : "Show Sliced"}
//             </button>

//             <div>
//               {isSlicedView ? (
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: `${padding}px` }}>
//                   {/* {ImageUrisSlices.map((ImageUrisSlice, index) => (
//                                         <img
//                                             key={index}
//                                             src={ImageUrisSlice}
//                                             alt={`Slice ${index}`}
//                                             style={{
//                                                 width: `${(img.width || 0) / cols}px`,
//                                                 height: `${(img.height || 0) / rows}px`,
//                                                 objectFit: "contain",
//                                                 border: "1px solid #ccc",
//                                             }}
//                                         />
                                        
//                                     ))} */}
//                   <div className="flex flex-wrap gap-4 my-8 px-5 justify">
//                     {FragmentCollectibles.map(nft => (
//                       <FragNFTCard nft={nft} key={nft.fragId} />
//                     ))}
//                   </div>

//                 </div>

//               ) : (

//                 <div style={{ padding: `${padding}px`, display: 'inline-block' }}>
//                   <img src={reconstructedImageSrc || nft.image || ''} alt="Reconstructed" style={{ display: 'block', margin: 'auto' }} />

//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Right side: Input fields and button */}
//       <div className="flex flex-col justify-start ml-6 w-[250px] space-y-4">
//         <div className="mb-4">
//           <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
//           <input
//             type="number"
//             id="rentPrice"
//             className="input input-bordered w-full"
//             value={Price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="shardCount" className="text-lg font-semibold">Shard Count:</label>
//           <input
//             type="number"
//             id="shardCount"
//             ref={shardCountInputRef} // Use ref to store shardCount value
//             defaultValue={1} // Default value for shardCount
//             min="1"
//             className="input input-bordered w-full mt-2"
//             placeholder="Enter number of shards"
//           />
//         </div>
//         <button
//           className="btn btn-primary w-full mt-4"
//           onClick={handleActionButtonClick}
//         >
//           Submit
//         </button>
//       </div>


//     </div>
//   );
// };

// export default ImageSlicePage;


// import { notification } from "~~/utils/scaffold-eth";
// import { useRouter } from "next/navigation";
// import FragNFTCard from "./FragNFTCard";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { useState, useEffect, useRef } from "react";
// import { Collectible } from "../../myNFTs/_components/MyHoldings";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { formatEther } from "viem";

// export interface TokenFragment extends Partial<NFTMetaData> {
//   fragId: string;
//   fragprice: string;
//   fragbuyer: string;
//   fragseller: string;
//   fragcreator: string;
//   isListedFragSale: boolean;
//   fragImageUri: string;
// }

// export const NFTCard = ({ nft }: { nft: Collectible }) => {
//     // const tokenIdInputRef = useRef<HTMLInputElement>(null); // Correct type for input element
//     const shardCountInputRef = useRef<HTMLInputElement>(null); // Correct type for input element
//     const [img, setImg] = useState<HTMLImageElement | null>(null);
//     const [ImageUrisSlices, setImageUriSlices] = useState<string[]>([]);
//     const [reconstructedImageSrc, setReconstructedImageSrc] = useState<string | null>(null);
//     const [isSlicedView, setIsSlicedView] = useState<boolean>(false);
//     const [shardCount, setShardCount] = useState<number>();
//     const [FragmentCollectibles, setFragmentCollectibles] = useState<TokenFragment[]>([]);
//     const [Price, setPrice] = useState(""); // Rent price state
//   const router = useRouter();

//   const rows = shardCount ? Math.ceil(Math.sqrt(shardCount)) : 0;
//   const cols = shardCount ? Math.ceil(shardCount / rows) : 0;

//   const padding = 5;

//   // Pinata configuration
//   const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

//   // Fetch fragment URLs from the contract after storing
//   const { data: tokenFragmentsUrl } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAllFragmentsForToken",
//     args: [BigInt(nft.id)],
//   });
 

//   const [showModal, setShowModal] = useState(false); // State to manage modal visibility



//   const closeModal = () => {
//     setShowModal(false);
//   };




//   const fetchListedNfts = async (): Promise<void> => {

//     try {
//       const fetchedNfts: TokenFragment[] = await Promise.all(
//         (tokenFragmentsUrl || []).map(async (item: any) => {
//           const fragId: string = item.fragId.toString();
//           const fragprice = formatEther(item.fragprice);
//           const fragbuyer: string = item.fragbuyer;
//           const fragseller: string = item.fragseller;
//           const fragcreator: string = item.fragcreator;
//           const isListedFragSale: boolean = item.isListedFragSale;
//           const fragImageUri: string = item.fragImageUri;

//           return {
//             fragId,
//             fragprice,
//             fragbuyer,
//             fragseller,
//             fragcreator,
//             isListedFragSale,
//             fragImageUri,

//           };
//         })
//       );
//       setFragmentCollectibles(fetchedNfts);
//     } catch (err) {
//       console.error("Error fetching NFTs:", err);
//       notification.error("Error fetching NFTs");
//     }
//   };




//   useEffect(() => {
//     if (tokenFragmentsUrl && Array.isArray(tokenFragmentsUrl)) {
//       const fragImageUris = tokenFragmentsUrl.map((fragment: any) => fragment.fragImageUri);
//       console.log(fragImageUris);
//       // setImageUriSlices(fragImageUris);
//       setShardCount(fragImageUris.length)
//       fetchListedNfts();
//       reconstructImage(fragImageUris, fragImageUris.length); // Reconstruct image from contract fragments
//     }
//   }, [tokenFragmentsUrl]);


//   useEffect(() => {

//     if (nft.image) {

//       const imgElement = new Image();
//       imgElement.crossOrigin = "Anonymous";
//       imgElement.src = nft.image;
//       imgElement.onload = () => setImg(imgElement);

//     }
//   }, [nft.image]);




//   const sliceImage = async (imgElement: HTMLImageElement, fragCount: number): Promise<string[]> => {
//     const rows = Math.ceil(Math.sqrt(fragCount));
//     const cols = Math.ceil(fragCount / rows);

//     const imgWidth = imgElement.width;
//     const imgHeight = imgElement.height;
//     const sliceWidth = imgWidth / cols - padding;
//     const sliceHeight = imgHeight / rows - padding;

//     const sliceArray: string[] = [];

//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < cols; col++) {
//         const sx = col * (imgWidth / cols);
//         const sy = row * (imgHeight / rows);
//         const sWidth = imgWidth / cols;
//         const sHeight = imgHeight / rows;

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           canvas.width = sliceWidth + padding;
//           canvas.height = sliceHeight + padding;

//           ctx.drawImage(
//             imgElement,
//             sx,
//             sy,
//             sWidth,
//             sHeight,
//             padding / 2,
//             padding / 2,
//             sliceWidth,
//             sliceHeight
//           );

//           const dataUrl = canvas.toDataURL();
//           sliceArray.push(dataUrl);
//         }
//       }
//     }

//     // Upload slices and return the URLs
//     const uploadedUrls = await uploadSlicesToPinata(sliceArray);
//     return uploadedUrls; // Return the uploaded URLs
//   };

//  // Upload the slices to Pinata and return the URLs
//  const uploadSlicesToPinata = async (slices: string[]): Promise<string[]> => {

//   const uploadedUrls: string[] = [];

//   for (const slice of slices) {
//     const formData = new FormData();
//     const blob = await fetch(slice).then(res => res.blob()); // Convert base64 to Blob
//     formData.append("file", blob, "slice.png");

//     try {
//       const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${pinataJWT}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.IpfsHash) {
//         const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//         uploadedUrls.push(imageUrl); // Store the URL of the uploaded slice
//       } else {
//         console.error("Error uploading slice:", slice);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   }

//   return uploadedUrls;
// };


//   const reconstructImage = (sliceArray: string[], fragCount: number) => {
//     // Calculate rows and columns based on the number of fragments
//     const rows = Math.ceil(Math.sqrt(fragCount));
//     const cols = Math.ceil(fragCount / rows);

//     // Create a canvas to reconstruct the image
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     if (!ctx) return;

//     // Set canvas dimensions based on the number of fragments
//     const imgWidth = 500; // You can set a default width, or dynamically fetch it if known
//     const imgHeight = 500; // You can set a default height, or dynamically fetch it if known
//     const sliceWidth = imgWidth / cols;
//     const sliceHeight = imgHeight / rows;

//     // Set canvas size to the original image dimensions
//     canvas.width = imgWidth;
//     canvas.height = imgHeight;

//     // Track the number of loaded images
//     let loadedImages = 0;

//     // Iterate over each slice in the sliceArray
//     sliceArray.forEach((slice, index) => {
//       const row = Math.floor(index / cols); // Determine the row for the current slice
//       const col = index % cols; // Determine the column for the current slice

//       const x = col * sliceWidth;
//       const y = row * sliceHeight;

//       const img = new Image();
//       img.src = slice; // Set image source to the base64 or IPFS URL

//       // Set cross-origin attribute to allow canvas export
//       img.crossOrigin = "Anonymous";

//       // Once the image is loaded, draw it on the canvas
//       img.onload = () => {
//         ctx.drawImage(img, x, y, sliceWidth, sliceHeight);

//         // Check if all images have been loaded to finalize the reconstruction
//         loadedImages += 1;
//         if (loadedImages === sliceArray.length) {
//           try {
//             const dataURL = canvas.toDataURL(); // Convert canvas to Data URL (base64)
//             setReconstructedImageSrc(dataURL); // Set the final reconstructed image source
//             console.log(dataURL); // Optionally log the data URL for debugging
//           } catch (error) {
//             console.error("Error converting canvas to dataURL:", error);
//           }
//         }
//       };

//       // Handle image loading errors
//       img.onerror = () => {
//         console.error("Failed to load image:", slice);
//       };
//     });
//   };


//   const handleActionButtonClick = async () => {
//     // const tokenId = tokenIdInputRef.current?.value; // Use optional chaining to avoid undefined errors
//     const shardCount = shardCountInputRef.current?.value; // Use optional chaining
//     console.log("片数", shardCount)


//     if (!img) {
//       notification.error("Image not loaded.");
//       return;
//     }
//     const fragmentUrls = await sliceImage(img, Number(shardCount));// Use the sliced URLs to store in contract
    

//     try {
//       //   await writeContractAsync({
//       //     functionName: "createFragmentizationNFT",
//       //     args: [BigInt(nft.tokenId), BigInt(Number(shardCount)), fragmentUrls,parseEther(Price)],
//       // });

//       notification.success("NFT fragments created successfully!");

//     } catch (error) {
//       notification.error("Failed to create NFT fragments.");
//     }
//   };


//   const toggleView = () => setIsSlicedView(!isSlicedView);

//   return (
//     <div className="card card-compact bg-base-100 shadow-lg w-[300px] h-[500px] shadow-secondary group relative overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
//       <figure className="relative">
//         <img
//           src={nft.image}
//           alt="NFT Image"
//           className="h-60 min-w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
//         />
//       </figure>

//       <div className="flex-grow">
//         {nft.image && img && (
//           <div>
//             <button onClick={toggleView} className="btn btn-secondary mb-4">
//               {isSlicedView ? "Show Original" : "Show Sliced"}
//             </button>

//             <div>
//               {isSlicedView ? (
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: `${padding}px` }}>
                 
//                   <div className="flex flex-wrap gap-4 my-8 px-5 justify">
//                     {FragmentCollectibles.map(nft => (
//                       <FragNFTCard nft={nft} key={nft.fragId} />
//                     ))}
//                   </div>

//                 </div>

//               ) : (

//                 <div style={{ padding: `${padding}px`, display: 'inline-block' }}>
//                   <img src={reconstructedImageSrc || nft.image || ''} alt="Reconstructed" style={{ display: 'block', margin: 'auto' }} />

//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>




//       {/* Modal for confirming rental */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
//             <div className="mb-4">
//               <label htmlFor="rentPrice" className="block mb-2 text-lg">Rent Price (ETH)</label>
//               <input
//                 type="number"
//                 id="rentPrice"
//                 className="input input-bordered w-full"
//                 value={Price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="shardCount" className="text-lg font-semibold">Shard Count:</label>
//               <input
//                 type="number"
//                 id="shardCount"
//                 ref={shardCountInputRef} // Use ref to store shardCount value
//                 defaultValue={1} // Default value for shardCount
//                 min="1"
//                 className="input input-bordered w-full mt-2"
//                 placeholder="Enter number of shards"
//               />
//             </div>
//             <div className="flex justify-between">

//               <button
//                 className="btn btn-secondary w-[45%]"
//                 onClick={handleActionButtonClick}
//               >
//                 确认碎片化
//               </button>
//               <button
//                 className="btn btn-primary w-[45%]"
//                 onClick={closeModal}
//               >
//                 取消
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };



import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Collectible } from "../../myNFTs/_components/MyHoldings";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { formatEther } from "viem";


export const NFTCard = ({ nft }: { nft: Collectible }) => {

    const router = useRouter();
    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
    const { data: NftFragmentDetail } = useScaffoldReadContract({
        contractName: "FragmentManager",
        functionName: "nftFragment",
        args: [BigInt(nft.id)],
      });

    if (!NftFragmentDetail?.[3]) {
        return null; // Don't render the component if rentalInformation?.[8] is false or undefined
    }

    const handleCardClick = () => {
        router.push(`/FragmentationNft/${nft.id}`);
      };

      console.log("11",nft.image)
    return (
        <div className="card card-compact bg-base-100 shadow-lg w-[300px] h-[500px] shadow-secondary group relative overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105"
        onClick={handleCardClick}
        >
            <figure className="relative">
                <img
                    src={nft.image}
                    alt="NFT Image"
                    className="h-60 min-w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
            </figure>

            <div className="mt-4">
                <div className="text-lg font-semibold">Auction Details:</div>
                <div className="flex space-x-3 mt-1 items-center">
                    <span className="text-lg font-semibold">
                        售卖人: <Address address={NftFragmentDetail?.[1] as `0x${string}`} />
                    </span>
                </div>
            </div>
        </div>
    );
};