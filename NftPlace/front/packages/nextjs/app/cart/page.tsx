// "use client";

// import { useEffect, useState } from "react";
// import { NFTCardCart } from "./_components/NFTCardCart";

// import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { formatEther } from "viem";
// import { useAccount } from "wagmi";


// export interface CartCollectible extends Partial<NFTMetaData> {
//   tokenId: string;
//   price: string;
//   seller: string;
//   isListed: boolean;
//   tokenURI: string;
// }

// export const Cart = () => {
//     const { address: connectedAddress } = useAccount();
//   const [Cartollectibles, setCartCollectibles] = useState<CartCollectible[]>([]);
//   const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);

//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });

//   const { data: CartNfts } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getUserCart",
//     args: [connectedAddress],
//     watch: true,
//   });

//   console.log("CartNfts", CartNfts);
//   const fetchListedNfts = async (): Promise<void> => {
//     setAllCollectiblesLoading(true);
//     try {
//       const fetchedNfts: CartCollectible[] = await Promise.all(
//         (CartNfts || []).map(async (item: any) => {
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
//       setCartCollectibles(fetchedNfts);
//     }catch (err) {
//       console.error("Error fetching NFTs:", err);
//       notification.error("Error fetching NFTs");
//     }finally{
//       setAllCollectiblesLoading(false);
//     }
//  };

//  useEffect(() =>{
//   if(!CartNfts || !yourCollectibleContract) return
//   fetchListedNfts();
//  },[CartNfts]);

//   if (allCollectiblesLoading)
//     return (
//       <div className="flex justify-center items-center mt-10">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );

//   return (
//     <>
//       {Cartollectibles.length === 0 ? (
//         <div className="flex justify-center items-center mt-10">
//           <div className="text-2xl text-primary-content">No NFTs found</div>
//         </div>
//       ) : (
//         <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
//           {Cartollectibles.map(nft => (
//             <NFTCardCart nft={nft} key={nft.tokenId} />
//           ))}
//         </div>
//       )}
//     </>
//   );
// };
// export default Cart;  




// "use client";
// import { useState } from "react";
// import { MerkleTree } from "merkletreejs";
// import { isAddress } from "viem"; // 使用 wagmi 的地址验证函数
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { soliditySha3 } from "web3-utils";

// const MerkleTreePage = () => {
//   // 用于存储用户输入的地址列表
//   const [addresses, setAddresses] = useState<string[]>([]);
//   const [newAddress, setNewAddress] = useState<string>("");
//   const [startTokenId, setStartTokenId] = useState<number | null>(null);
//   const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
//   const [proofs, setProofs] = useState<Record<string, string[]> | null>(null);
//   const [leaves, setLeaves] = useState<string[]>([]); // 用于存储所有叶子节点
//   const [step, setStep] = useState<number>(1); // 表示当前步骤

//   // 获取合约实例
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

//   // 添加新地址到地址列表
//   const addAddress = () => {
//     if (isAddress(newAddress)) {
//       setAddresses([...addresses, newAddress]);
//       setNewAddress("");
//     } else {
//       alert("请输入有效的以太坊地址");
//     }
//   };

//   // 生成 Merkle Tree
//   const generateMerkleTree = async () => {
//     if (addresses.length === 0) {
//       alert("地址列表为空，无法生成 Merkle Tree");
//       return;
//     }
//     if (startTokenId === null) {
//       alert("请指定开始的 Token ID");
//       return;
//     }

//     // 使用 Solidity 一致的方式生成叶子节点
//     const generatedLeaves = addresses.map((addr, index) => {
//       const tokenId = startTokenId + index;
//       const leaf = soliditySha3(
//         { type: "address", value: addr },
//         { type: "uint256", value: String(tokenId) }
//       );
//       return leaf;
//     });
 
//     setLeaves(generatedLeaves.filter((leaf): leaf is string => leaf !== null));

//     // 创建 Merkle Tree
//     const tree = new MerkleTree(generatedLeaves, soliditySha3, { sortPairs: true });
//     // 获取 Merkle Root
//     const root = tree.getHexRoot();
//     setMerkleRoot(root);

//     // 生成每个地址的 Merkle Proof
//     const generatedProofs: Record<string, string[]> = {};
//     addresses.forEach((addr, index) => {
//       const tokenId = startTokenId + index;
//       const leaf = soliditySha3(
//         { type: "address", value: addr },
//         { type: "uint256", value: String(tokenId) }
//       ) as string;
 
//       const proof = tree.getHexProof(leaf);
//       console.log("!!!!!!!!!!!!",leaf)
//             console.log("1231222222222",proof)
//       generatedProofs[`${addr}-${tokenId}`] = proof;
//       console.log("路径下面的=================",generatedProofs[`${addr}-${tokenId}`])
//     });
//     setProofs(generatedProofs);
//     setStep(4); // 设置为结果展示步骤
//   };

//   // 重置所有状态
//   const reset = () => {
//     setAddresses([]);
//     setNewAddress("");
//     setStartTokenId(null);
//     setMerkleRoot(null);
//     setProofs(null);
//     setLeaves([]);
//     setStep(1);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//       <h1>Merkle Tree 生成器</h1>
//       <p>步骤 {step}/4</p>

//       {step === 1 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h3>1. 输入地址列表</h3>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <input
//               type="text"
//               value={newAddress}
//               placeholder="输入以太坊地址"
//               onChange={(e) => setNewAddress(e.target.value)}
//               style={{ marginRight: "10px", padding: "10px", flex: "1" }}
//             />
//             <button onClick={addAddress} style={{ padding: "10px" }}>
//               添加地址
//             </button>
//           </div>

//           <div style={{ marginTop: "20px" }}>
//             <h4>地址列表</h4>
//             {addresses.length === 0 && <p>暂无地址，添加一些地址开始。</p>}
//             <ul>
//               {addresses.map((addr, index) => (
//                 <li key={index}>{addr}</li>
//               ))}
//             </ul>
//             {addresses.length > 0 && (
//               <div style={{ marginTop: "20px" }}>
//                 <button onClick={() => setStep(2)} style={{ padding: "10px" }}>
//                   下一步
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h3>2. 输入起始 Token ID</h3>
//           <input
//             type="number"
//             value={startTokenId ?? ""}
//             placeholder="请输入开始的 Token ID"
//             onChange={(e) => setStartTokenId(Number(e.target.value))}
//             style={{ marginRight: "10px", padding: "10px", width: "100%" }}
//           />
//           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//             <button onClick={() => setStep(1)} style={{ padding: "10px" }}>
//               上一步
//             </button>
//             <button onClick={() => setStep(3)} style={{ padding: "10px" }}>
//               下一步
//             </button>
//           </div>
//         </div>
//       )}

//       {step === 3 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h3>3. 生成 Merkle Tree</h3>
//           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//             <button onClick={() => setStep(2)} style={{ padding: "10px" }}>
//               上一步
//             </button>
//             <button
//               onClick={generateMerkleTree}
//               style={{ padding: "15px", flex: "1" }}
//             >
//               生成 Merkle Tree
//             </button>
//           </div>
//         </div>
//       )}

//       {step === 4 && (
//         <div style={{ marginBottom: "20px" }}>
//           {merkleRoot && (
//             <div style={{ marginBottom: "20px" }}>
//               <h3>Merkle Root</h3>
//               <p style={{ background: "#f9f9f9", padding: "10px" }}>
//                 {merkleRoot}
//               </p>
//             </div>
//           )}

//           {leaves && proofs && (
//             <div style={{ marginBottom: "20px" }}>
//               <h3>叶子节点与 Merkle Proofs</h3>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   marginTop: "20px",
//                 }}
//               >
//                 <thead>
//                   <tr>
//                     <th
//                       style={{
//                         border: "1px solid #ddd",
//                         padding: "10px",
//                         textAlign: "left",
//                       }}
//                     >
//                       地址和 Token ID
//                     </th>
//                     <th
//                       style={{
//                         border: "1px solid #ddd",
//                         padding: "10px",
//                         textAlign: "left",
//                       }}
//                     >
//                       哈希值
//                     </th>
//                     <th
//                       style={{
//                         border: "1px solid #ddd",
//                         padding: "10px",
//                         textAlign: "left",
//                       }}
//                     >
//                       Merkle Proof
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {addresses.map((addr, index) => {
//                     const tokenId = startTokenId! + index;
//                     const key = `${addr}-${tokenId}`;
//                     return (
//                       <tr key={index}>
//                         <td
//                           style={{
//                             border: "1px solid #ddd",
//                             padding: "10px",
//                           }}
//                         >
//                           {key}
//                         </td>
//                         <td
//                           style={{
//                             border: "1px solid #ddd",
//                             padding: "10px",
//                           }}
//                         >
//                           {leaves[index]}
//                         </td>
//                         <td
//                           style={{
//                             border: "1px solid #ddd",
//                             padding: "10px",
//                           }}
//                         >
//                           <ul style={{ paddingLeft: "20px" }}>
//                             {proofs[key].map((p, i) => (
//                               <li key={i} style={{ color: "#666" }}>
//                                 {p}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//             <button onClick={() => setStep(3)} style={{ padding: "10px" }}>
//               上一步
//             </button>
//             <button onClick={reset} style={{ padding: "15px", flex: "1" }}>
//               重置
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MerkleTreePage;
// import React, { useState } from 'react';

// const DateTimeInput = () => {
//   // 为三个时间输入框设置独立的状态
//   const [selectedDateTime1, setSelectedDateTime1] = useState("");
//   const [selectedDateTime2, setSelectedDateTime2] = useState("");
//   const [selectedDateTime3, setSelectedDateTime3] = useState("");

//   const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDateTime1(event.target.value);
//   };

//   const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDateTime2(event.target.value);
//   };

//   const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDateTime3(event.target.value);
//   };

//   const handleSubmit = () => {
//     if (selectedDateTime1 && selectedDateTime2 && selectedDateTime3) {
//       // 将日期时间传递给后端
//       fetch('http://your-backend-api.com/save-time', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           datetime1: selectedDateTime1,
//           datetime2: selectedDateTime2,
//           datetime3: selectedDateTime3,
//         }),  // 传递给后端的时间
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log('Success:', data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//     } else {
//       alert("请选择所有时间");
//     }
//   };

//   return (

    
//     <div>
//       <label htmlFor="datetime1">选择时间 1:</label>
//       <input
//         id="datetime1"
//         type="datetime-local"
//         value={selectedDateTime1}
//         onChange={handleChange1}
//         style={{
//           padding: '8px',
//           border: '2px solid gray',
//           borderRadius: '4px',
//           fontSize: '16px',
//           width: '200px',
//           marginBottom: '10px',
//         }}
    
//       />
//       <br />

//       <label htmlFor="datetime2">选择时间 2:</label>
//       <input
//         id="datetime2"
//         type="datetime-local"
//         value={selectedDateTime2}
//         onChange={handleChange2}
//         style={{
//           padding: '8px',
//           border: '2px solid gray',
//           borderRadius: '4px',
//           fontSize: '16px',
//           width: '200px',
//           marginBottom: '10px',
//         }}
       
//       />
//       <br />

//       <label htmlFor="datetime3">选择时间 3:</label>
//       <input
//         id="datetime3"
//         type="datetime-local"
//         value={selectedDateTime3}
//         onChange={handleChange3}
//         style={{
//           padding: '8px',
//           border: '2px solid gray',
//           borderRadius: '4px',
//           fontSize: '16px',
//           width: '200px',
//           marginBottom: '10px',
//         }}
      
//       />
//       <br />

//       <button onClick={handleSubmit}>提交</button>
//     </div>
//   );
// };

// export default DateTimeInput;




