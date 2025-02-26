//   "use client";

//   import { MyHoldings } from "./_components";
//   import type { NextPage } from "next";
//   import { useAccount } from "wagmi";
//   import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
//   import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
//   import { notification } from "~~/utils/scaffold-eth";
//   import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
//   import { useState } from "react";

//   // Pinata configuration
//   const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

//   const MyNFTs: NextPage = () => {
//     const { address: connectedAddress, isConnected, isConnecting } = useAccount();
//     const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [nftData, setNftData] = useState({
//       name: "",
//       description: "",
//       image: "",
//     });

//     // Handle image upload to Pinata
//     const handleImageUpload = async (file: File) => {
//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${pinataJWT}`,
//           },
//           body: formData,
//         });

//         const data = await response.json();
//         if (data.IpfsHash) {
//           const imageUrl = `https://indigo-naval-toad-795.mypinata.cloud/ipfs/${data.IpfsHash}`;
//           setNftData((prevData) => ({
//             ...prevData,
//             image: imageUrl,
//           }));
//           notification.success("Image uploaded successfully!");
//         } else {
//           notification.error("Failed to upload image.");
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         notification.error("Error uploading image.");
//       }
//     };


//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const validTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more types if needed
//         if (validTypes.includes(file.type)) {
//           handleImageUpload(file);
//         } else {
//           notification.error("Invalid file type. Please upload an image.");
//         }
//       }
//     };

//     const handleMintItem = async () => {
//       const metadata = {
//         name: nftData.name,
//         description: nftData.description,
//         image: nftData.image,
//       };

//       const notificationId = notification.loading("Uploading to IPFS");

//       try {
//         const cid = await addToIPFS(metadata);
//         notification.remove(notificationId);
//         notification.success("Metadata uploaded to IPFS");

//         await writeContractAsync({
//           functionName: "mintItem",
//           args: [connectedAddress, cid],

//         });

//         // Close the modal and reset the form
//         setIsModalOpen(false);
//         resetForm();
//       } catch (error) {
//         notification.remove(notificationId);
//         console.error(error);
//       }
//     };

//     const resetForm = () => {
//       setNftData({
//         name: "",
//         description: "",
//         image: "",
//       });
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setNftData({
//         ...nftData,
//         [e.target.name]: e.target.value,
//       });
//     };



//     return (
//       <>
// <div style={{ padding: '20px', backgroundColor: '#f9f9f9', width: '100%', height: '90vh'}}>
//   <h1 style={{ fontSize: '24px', marginBottom: '20px' }} className="title">
//     Create
//   </h1>

//   <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }} className="tabs">
//     <button
//       style={{
//         padding: '10px 20px',
//         border: 'none',
//         backgroundColor: '#007bff',
//         color: 'white',
//         cursor: 'pointer',
//         borderRadius: '5px'
//       }}
//       onClick={() => { setIsModalOpen(true); resetForm(); }}
//     >
//       Mint NFT
//     </button>
//     <button
//       style={{
//         padding: '10px 20px',
//         border: 'none',
//         backgroundColor: '#f0f0f0',
//         cursor: 'pointer',
//         borderRadius: '5px'
//       }}
//     >
//       Collection or item
//     </button>
//   </div>

//   <div style={{ textAlign: 'center', marginTop: '20px' }} className="nft-display">
//     {nftData.image && <img style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} src={nftData.image} alt="NFT Preview" />}
//   </div>
// </div>

//       {isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//               <h2 className="text-xl font-bold mb-4">Mint New NFT</h2>

//               <div className="form-control mb-4">
//                 <label className="label">Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={nftData.name}
//                   onChange={handleInputChange}
//                   className="input input-bordered w-full"
//                 />
//               </div>

//               <div className="form-control mb-4">
//                 <label className="label">Description:</label>
//                 <textarea
//                   name="description"
//                   value={nftData.description}
//                   onChange={handleInputChange}
//                   className="textarea textarea-bordered w-full"
//                 />
//               </div>

//               <div className="form-control mb-4">
//                 <label className="label">Image:</label>
//                 <label className="btn w-full">
//                   {nftData.image ? "文件已选择" : "选择图片"}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden" // 隐藏原始的文件输入
//                   />
//                 </label>
//               </div>

//               <div className="modal-action flex justify-between">
//                 <button className="btn" onClick={handleMintItem}>Submit</button>
//                 <button className="btn btn-outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}
// {/* 
//         <MyHoldings /> */}
//       </>
//     );
//   };

//   export default MyNFTs;


"use client";
import { MyHoldings } from "../myNFTs/_components/MyHoldings";
import type { NextPage } from "next";

const MyNFTs: NextPage = () => {

  return (
    <>
      <MyHoldings />
    </>
  );
};

export default MyNFTs;