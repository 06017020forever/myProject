// // "use client";
// // import { useState } from "react";
// // import { MerkleTree } from "merkletreejs";
// // import { isAddress } from "viem"; // 使用 wagmi 的地址验证函数
// // import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// // import { soliditySha3 } from "web3-utils";

// // const MerkleTreePage = () => {
// //   // 用于存储用户输入的地址列表
// //   const [addresses, setAddresses] = useState<string[]>([]);
// //   const [newAddress, setNewAddress] = useState<string>("");
// //   const [startTokenId, setStartTokenId] = useState<number | null>(null);
// //   const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
// //   const [proofs, setProofs] = useState<Record<string, string[]> | null>(null);
// //   const [leaves, setLeaves] = useState<string[]>([]); // 用于存储所有叶子节点
// //   const [step, setStep] = useState<number>(1); // 表示当前步骤

// //   // 获取合约实例
// //   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

// //   // 添加新地址到地址列表
// //   const addAddress = () => {
// //     if (isAddress(newAddress)) {
// //       setAddresses([...addresses, newAddress]);
// //       setNewAddress("");
// //     } else {
// //       alert("请输入有效的以太坊地址");
// //     }
// //   };

// //   // 生成 Merkle Tree
// //   const generateMerkleTree = async () => {
// //     if (addresses.length === 0) {
// //       alert("地址列表为空，无法生成 Merkle Tree");
// //       return;
// //     }
// //     if (startTokenId === null) {
// //       alert("请指定开始的 Token ID");
// //       return;
// //     }

// //     // 使用 Solidity 一致的方式生成叶子节点
// //     const generatedLeaves = addresses.map((addr, index) => {
// //       const tokenId = startTokenId + index;
// //       const leaf = soliditySha3(
// //         { type: "address", value: addr },
// //         { type: "uint256", value: String(tokenId) }
// //       );
// //       return leaf;
// //     });
// //     setLeaves(generatedLeaves.filter((leaf): leaf is string => leaf !== null));

// //     // 创建 Merkle Tree
// //     const tree = new MerkleTree(generatedLeaves, soliditySha3, { sortPairs: true });
// //     // 获取 Merkle Root
// //     const root = tree.getHexRoot();
// //     setMerkleRoot(root);
// //     // 将 Merkle Root 写入合约
// //     // await writeContractAsync({
// //     //   functionName: "setMerkleRoot",
// //     //   args: [root as `0x${string}`],
// //     // });

// //     // 生成每个地址的 Merkle Proof
// //     const generatedProofs: Record<string, string[]> = {};
// //     addresses.forEach((addr, index) => {
// //       const tokenId = startTokenId + index;
// //       const leaf = soliditySha3(
// //         { type: "address", value: addr },
// //         { type: "uint256", value: String(tokenId) }
// //       ) as string;
// //       const proof = tree.getHexProof(leaf);
// //       generatedProofs[`${addr}-${tokenId}`] = proof;
// //     });
// //     setProofs(generatedProofs);
// //     setStep(4); // 设置为结果展示步骤
// //   };

// //   // 重置所有状态
// //   const reset = () => {
// //     setAddresses([]);
// //     setNewAddress("");
// //     setStartTokenId(null);
// //     setMerkleRoot(null);
// //     setProofs(null);
// //     setLeaves([]);
// //     setStep(1);
// //   };

// //   return (
// //     <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
// //       <h1>Merkle Tree 生成器</h1>
// //       <p>步骤 {step}/4</p>

// //       {step === 1 && (
// //         <div style={{ marginBottom: "20px" }}>
// //           <h3>1. 输入地址列表</h3>
// //           <div style={{ display: "flex", alignItems: "center" }}>
// //             <input
// //               type="text"
// //               value={newAddress}
// //               placeholder="输入以太坊地址"
// //               onChange={(e) => setNewAddress(e.target.value)}
// //               style={{ marginRight: "10px", padding: "10px", flex: "1" }}
// //             />
// //             <button onClick={addAddress} style={{ padding: "10px" }}>
// //               添加地址
// //             </button>
// //           </div>

// //           <div style={{ marginTop: "20px" }}>
// //             <h4>地址列表</h4>
// //             {addresses.length === 0 && <p>暂无地址，添加一些地址开始。</p>}
// //             <ul>
// //               {addresses.map((addr, index) => (
// //                 <li key={index}>{addr}</li>
// //               ))}
// //             </ul>
// //             {addresses.length > 0 && (
// //               <div style={{ marginTop: "20px" }}>
// //                 <button onClick={() => setStep(2)} style={{ padding: "10px" }}>
// //                   下一步
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {step === 2 && (
// //         <div style={{ marginBottom: "20px" }}>
// //           <h3>2. 输入起始 Token ID</h3>
// //           <input
// //             type="number"
// //             value={startTokenId ?? ""}
// //             placeholder="请输入开始的 Token ID"
// //             onChange={(e) => setStartTokenId(Number(e.target.value))}
// //             style={{ marginRight: "10px", padding: "10px", width: "100%" }}
// //           />
// //           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
// //             <button onClick={() => setStep(1)} style={{ padding: "10px" }}>
// //               上一步
// //             </button>
// //             <button onClick={() => setStep(3)} style={{ padding: "10px" }}>
// //               下一步
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {step === 3 && (
// //         <div style={{ marginBottom: "20px" }}>
// //           <h3>3. 生成 Merkle Tree</h3>
// //           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
// //             <button onClick={() => setStep(2)} style={{ padding: "10px" }}>
// //               上一步
// //             </button>
// //             <button
// //               onClick={generateMerkleTree}
// //               style={{ padding: "15px", flex: "1" }}
// //             >
// //               生成 Merkle Tree
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {step === 4 && (
// //         <div style={{ marginBottom: "20px" }}>
// //           {merkleRoot && (
// //             <div style={{ marginBottom: "20px" }}>
// //               <h3>Merkle Root</h3>
// //               <p style={{ background: "#f9f9f9", padding: "10px" }}>
// //                 {merkleRoot}
// //               </p>
// //             </div>
// //           )}

// //           {leaves && proofs && (
// //             <div style={{ marginBottom: "20px" }}>
// //               <h3>叶子节点与 Merkle Proofs</h3>
// //               <table
// //                 style={{
// //                   width: "100%",
// //                   borderCollapse: "collapse",
// //                   marginTop: "20px",
// //                 }}
// //               >
// //                 <thead>
// //                   <tr>
// //                     <th
// //                       style={{
// //                         border: "1px solid #ddd",
// //                         padding: "10px",
// //                         textAlign: "left",
// //                       }}
// //                     >
// //                       地址和 Token ID
// //                     </th>
// //                     <th
// //                       style={{
// //                         border: "1px solid #ddd",
// //                         padding: "10px",
// //                         textAlign: "left",
// //                       }}
// //                     >
// //                       哈希值
// //                     </th>
// //                     <th
// //                       style={{
// //                         border: "1px solid #ddd",
// //                         padding: "10px",
// //                         textAlign: "left",
// //                       }}
// //                     >
// //                       Merkle Proof
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {addresses.map((addr, index) => {
// //                     const tokenId = startTokenId! + index;
// //                     const key = `${addr}-${tokenId}`;
// //                     return (
// //                       <tr key={index}>
// //                         <td
// //                           style={{
// //                             border: "1px solid #ddd",
// //                             padding: "10px",
// //                           }}
// //                         >
// //                           {key}
// //                         </td>
// //                         <td
// //                           style={{
// //                             border: "1px solid #ddd",
// //                             padding: "10px",
// //                           }}
// //                         >
// //                           {leaves[index]}
// //                         </td>
// //                         <td
// //                           style={{
// //                             border: "1px solid #ddd",
// //                             padding: "10px",
// //                           }}
// //                         >
// //                           <ul style={{ paddingLeft: "20px" }}>
// //                             {proofs[key].map((p, i) => (
// //                               <li key={i} style={{ color: "#666" }}>
// //                                 {p}
// //                               </li>
// //                             ))}
// //                           </ul>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}

// //           <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
// //             <button onClick={() => setStep(3)} style={{ padding: "10px" }}>
// //               上一步
// //             </button>
// //             <button onClick={reset} style={{ padding: "15px", flex: "1" }}>
// //               重置
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MerkleTreePage;



"use client";

import { useState,useEffect } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import axios from "axios"; // Import axios
import { endianness } from "os";
// Pinata configuration
const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// Define the state type for nftData
interface NftData {
  name: string;
  description: string;
  images: string[]; // images is now explicitly a string[] array
}

export default function CreateNFT() {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
  const [selectedDateTime1, setSelectedDateTime1] = useState<string>("");
  const [selectedDateTime2, setSelectedDateTime2] = useState<string>("");
  const [selectedDateTime3, setSelectedDateTime3] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [airTimeData, setAirTimeData] = useState([]);

    const fetchNftData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8080/nftUser/getAirDropSetTime"); // Send GET request to the backend
            if (response.data) {
                setAirTimeData(response.data);
            }
        } catch (error) {
            console.error("Error fetching NFT data:", error);
            // Optionally handle the error (e.g., show an error message to the user)
        }
    };

 useEffect(() => {

  fetchNftData();

 });


  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateTime1(event.target.value);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateTime2(event.target.value);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateTime3(event.target.value);
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPeriod(event.target.value);  // 更新"空投第几期"
  };

  const [nftData, setNftData] = useState<NftData>({
    name: "",
    description: "",
    images: [],
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.IpfsHash) {
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        setNftData((prevData) => ({
          ...prevData,
          images: [...prevData.images, imageUrl],

        }));
        notification.success("Image uploaded successfully!");
      } else {
        notification.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      notification.error("Error uploading image.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      Array.from(files).forEach((file) => {
        if (validTypes.includes(file.type)) {
          handleImageUpload(file);
        } else {
          notification.error("Invalid file type. Please upload an image.");
        }
      });
    }
  };

  const convertToTimestamp = (dateTime: string | undefined): number | null => {
    return dateTime ? new Date(dateTime).getTime() : null; // Converts to timestamp (milliseconds)
  };


  const handleMintItem = async () => {


    const notificationId = notification.loading("Uploading to IPFS");

    try {
      setIsUploading(true);
      // const cidArray = await Promise.all(nftData.images.map((image) => addToIPFS({ image })));
      const cidArray = await Promise.all(nftData.images.map(async (image) => {
        const metadata = {
          name: nftData.name,
          description: nftData.description,
          image: image,
        };
        console.log(metadata)
        const cid = await addToIPFS(metadata);
        console.log(cid)
        return cid;

      }));
      console.log(cidArray);
      notification.remove(notificationId);
      notification.success("Metadata uploaded to IPFS");
      console.log(cidArray);

      await writeContractAsync({
        functionName: "mintBatch",
        args: [cidArray, BigInt(cidArray.length)],
      });

      resetForm();
      if (selectedDateTime1 === "" || selectedDateTime2 === "" || selectedDateTime3 === "") {
        return;
      }
      await axios.post("http://127.0.0.1:8080/nftUser/airDropTime",
        {
          startTmie: convertToTimestamp(selectedDateTime1),
          dropTime: convertToTimestamp(selectedDateTime2),
          endTime: convertToTimestamp(selectedDateTime3),
          period: selectedPeriod, // 新增：传递空投期
          droperaddress:connectedAddress,
        }
      );

      setIsUploading(false);
    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setNftData({
      name: "",
      description: "",
      images: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNftData({
      ...nftData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveImage = (image: string) => {
    setNftData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((img) => img !== image),
    }));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-gray-800">
                        第{airTimeData[0]?.period}期空投结束
                    </h1>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
          <a href="/CreateCollection">
            <button style={{ background: "none", border: "none", cursor: "pointer", marginRight: "1rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </a>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Create</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div style={{ border: "2px dashed #e2e8f0", borderRadius: "0.5rem", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", backgroundColor: "white" }}>
            {!isUploading && nftData.images.length > 0 && (
              <div>
                {nftData.images.map((image, index) => (
                  <div key={index} style={{ position: "relative", width: "100%", maxWidth: "100%", height: "auto" }}>
                    <img
                      src={image}
                      alt={`NFT Preview ${index}`}
                      style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                    />
                    <button
                      onClick={() => handleRemoveImage(image)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "white" }}>
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isUploading && (
              <p>Uploading... Please wait until the images are uploaded and the NFT is minted.</p>
            )}
            <label style={{ cursor: "pointer", border: "2px solid #4CAF50", padding: "10px 20px", borderRadius: "5px", color: "#4CAF50", textAlign: "center" }}>
              Choose file
              <input type="file" accept="image/*" onChange={handleFileChange} multiple style={{ display: "none" }} />
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              name="name"
              value={nftData.name}
              onChange={handleInputChange}
              placeholder="NFT Name"
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
                width: "100%",
              }}
            />
            <textarea
              name="description"
              value={nftData.description}
              onChange={handleInputChange}
              placeholder="Description"
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
                width: "100%",
              }}
            ></textarea>

            <input
              type="text"
              value={selectedPeriod}
              onChange={handlePeriodChange} // 修改此行
              placeholder="空投第几期"
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
                width: "100%",
              }}
            />

            <label htmlFor="datetime1">空投开始时间:</label>
            <input
              id="datetime1"
              type="datetime-local"
              value={selectedDateTime1}
              onChange={handleChange1}
              style={{
                padding: '8px',
                border: '2px solid gray',
                borderRadius: '4px',
                fontSize: '16px',
                width: '200px',
                marginBottom: '10px',
              }}
            />
            <br />

            <label htmlFor="datetime2">空投领取时间:</label>
            <input
              id="datetime2"
              type="datetime-local"
              value={selectedDateTime2}
              onChange={handleChange2}
              style={{
                padding: '8px',
                border: '2px solid gray',
                borderRadius: '4px',
                fontSize: '16px',
                width: '200px',
                marginBottom: '10px',
              }}
            />
            <br />

            <label htmlFor="datetime3">空投结束时间:</label>
            <input
              id="datetime3"
              type="datetime-local"
              value={selectedDateTime3}
              onChange={handleChange3}
              style={{
                padding: '8px',
                border: '2px solid gray',
                borderRadius: '4px',
                fontSize: '16px',
                width: '200px',
                marginBottom: '10px',
              }}
            />
            <br />

          </div>

          <div style={{ paddingTop: '1rem' }}>
            <button
              onClick={handleMintItem}
              disabled={isUploading || !nftData.name || !nftData.description || nftData.images.length === 0}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "1rem 2rem",
                fontSize: "1rem",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "auto",
              }}
            >
              Create NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

