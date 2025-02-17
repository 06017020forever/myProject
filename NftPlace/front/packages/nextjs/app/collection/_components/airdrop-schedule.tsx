'use client'

// import { useState, useEffect } from 'react'
// import { ChevronDown } from 'lucide-react'

// export const cn = (...args: (string | undefined | false | null)[]): string => {
//     return args.filter(Boolean).join(' ');
// };

// interface Stage {
//     title: string
//     titleCn: string
//     date: string
//     dateCn: string
//     timestamp: number
//     status: 'Not eligible' | 'Eligible'
// }

// export default function AirdropSchedule() {
//     const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())

//     const stages: Stage[] = [
//         {
//             title: "Participation Stage",
//             titleCn: "参与空投阶段",
//             date: "November 30 at 12:50 PM GMT+8",
//             dateCn: "11月 30 日中午 14：29 GMT+8",
//             timestamp: new Date('2024-11-30T12:00:00+08:00').getTime(),
//             status: 'Eligible'
//         },
//         {
//             title: "Claim Stage",
//             titleCn: "领取空投阶段",
//             date: "November 30 at 12:00 PM GMT+8",
//             dateCn: "11月 30 日中午 14：35 GMT+8",
//             timestamp: new Date('2024-11-30T14:40:00+08:00').getTime(),
//             status: 'Not eligible'
//         }
//     ]

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTimestamp(Date.now())  // 每秒更新一次
//         }, 1000)

//         return () => clearInterval(timer)  // 清除定时器
//     }, [])

//     // 计算当前所在阶段的索引
//     const getCurrentStageIndex = () => {
//         let currentIndex = -1;

//         stages.forEach((stage, index) => {
//             const nextStage = stages[index + 1];

//             // 如果当前时间处于当前阶段和下一个阶段之间
//             if (nextStage) {
//                 if (currentTimestamp >= stage.timestamp && currentTimestamp < nextStage.timestamp) {
//                     currentIndex = index;
//                 }
//             } else {
//                 // 如果没有下一个阶段，说明当前时间超过了最后一个阶段
//                 if (currentTimestamp >= stage.timestamp) {
//                     currentIndex = index;
//                 }
//             }
//         });

//         return currentIndex === -1 ? stages.length - 1 : currentIndex;
//     };

//     return (
//         <div className="space-y-4">
//             <h3 className="text-xl font-medium">空投领取时间表</h3>
//             <div className="relative">
//                 {stages.map((stage, index) => {
//                     const currentIndex = getCurrentStageIndex();
//                     const isCurrentStage = currentIndex === index; // 判断是否是当前阶段
//                     const isPastStage = currentTimestamp > stage.timestamp; // 判断是否已过阶段

//                     return (
//                         <div key={index} className="relative">
//                             <div className="flex items-center gap-4 py-4">
//                                 <div className="relative">
//                                     <div
//                                         className={cn(
//                                             "w-4 h-4 rounded-full border-2 z-10 relative bg-background",
//                                             isCurrentStage || isPastStage ? "border-primary" : "border-gray-300"
//                                         )}
//                                     >
//                                         {(isCurrentStage || isPastStage) && (
//                                             <div className="absolute inset-1 rounded-full bg-primary" />
//                                         )}
//                                     </div>
//                                     {index !== stages.length - 1 && (
//                                         <div className={cn(
//                                             "absolute top-4 left-2 w-[2px] h-full -translate-x-1/2",
//                                             isPastStage ? "bg-primary" : "bg-gray-300"
//                                         )} />
//                                     )}
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="font-medium">
//                                         {stage.title}
//                                     </p>
//                                     <p className="font-medium">
//                                         {stage.titleCn}
//                                     </p>
//                                     <p className="text-gray-500 text-sm">
//                                         {stage.date}
//                                     </p>
//                                     <p className="text-gray-500 text-sm">
//                                         {stage.dateCn}
//                                     </p>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className={cn(
//                                         "text-sm",
//                                         stage.status === 'Eligible' ? "text-green-500" : "text-gray-500"
//                                     )}>
//                                         {stage.status} {stage.status === 'Eligible' ? '资格' : '无资格'}
//                                     </span>
//                                     <ChevronDown className="h-4 w-4 text-gray-500" />
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }
// 'use client'

// import { useState, useEffect } from 'react'
// import { ChevronDown } from 'lucide-react'

// export const cn = (...args: (string | undefined | false | null)[]): string => {
//     return args.filter(Boolean).join(' ');
// };

// interface Stage {
//   title: string
//   titleCn: string
//   date: string
//   dateCn: string
//   timestamp: number
//   status: 'Not eligible' | 'Eligible' | 'Ended'
// }

// export default function AirdropSchedule() {
//   const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())

//   const stages: Stage[] = [
//     {
//       title: "Participation Stage",
//       titleCn: "参与空投阶段",
//       date: "November 28 at 12:00 PM GMT+8",
//       dateCn: "11月 28 日中午 12：00 GMT+8",
//       timestamp: new Date('2024-11-30T15:40:00+08:00').getTime(),
//       status: 'Not eligible' // 设为默认状态
//     },
//     {
//       title: "Claim Stage",
//       titleCn: "领取空投阶段",
//       date: "December 5 at 12:00 PM GMT+8",
//       dateCn: "12月 5 日中午 12：00 GMT+8",
//       timestamp: new Date('2024-11-30T14:50:00+08:00').getTime(),
//       status: 'Not eligible'
//     },
//     {
//       title: "End Stage",
//       titleCn: "结束空投阶段",
//       date: "December 5 at 12:00 PM GMT+8",
//       dateCn: "12月 5 日中午 12：00 GMT+8",
//       timestamp: new Date('2024-11-30T19:50:00+08:00').getTime(),
//       status: 'Not eligible'
//     }
//   ]

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTimestamp(Date.now())
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   const getCurrentStageIndex = () => {
//     const currentIndex = stages.findIndex((stage, index) => {
//       const nextStage = stages[index + 1]
//       if (!nextStage) return true
//       return currentTimestamp >= stage.timestamp && currentTimestamp < nextStage.timestamp
//     })
//     return Math.max(0, currentIndex)
//   }

//   // 动态更新每个阶段的状态
//   const updateStageStatus = () => {
//     return stages.map((stage, index) => {
//       if (currentTimestamp < stage.timestamp) {
//         // 阶段未开始
//         return { ...stage, status: 'Not eligible' }
//       }
//       const nextStage = stages[index + 1]
//       if (nextStage && currentTimestamp < nextStage.timestamp) {
//         // 阶段正在进行
//         return { ...stage, status: 'Eligible' }
//       }
//       // 阶段已结束
//       return { ...stage, status: 'Ended' }
//     })
//   }

//   // 获取已更新的阶段
//   const updatedStages = updateStageStatus()

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-medium">空投领取时间表</h3>
//       <div className="relative">
//         {updatedStages.map((stage, index) => {
//           const isCurrentStage = getCurrentStageIndex() === index
//           const isPastStage = currentTimestamp > stage.timestamp
//           const isNextStage = getCurrentStageIndex() === index - 1;

//           return (
//             <div key={index} className="relative">
//               <div className="flex items-center gap-4 py-4">
//                 <div className="relative">
//                   <div 
//                     className={cn(
//                       "w-4 h-4 rounded-full border-2 z-10 relative bg-background",
//                       isCurrentStage ? "border-primary" : "border-gray-300"
//                     )}
//                   >
//                     {isCurrentStage && (
//                       <div className="absolute inset-1 rounded-full bg-primary" />
//                     )}
//                   </div>
//                   {index !== updatedStages.length - 1 && (
//                     <div className={cn(
//                       "absolute top-4 left-2 w-[1px] h-[185px] -translate-x-1/2",
//                       isNextStage ? "bg-primary" : "bg-gray-300"
//                     )} />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium">
//                     {stage.title}
//                   </p>
//                   <p className="font-medium">
//                     {stage.titleCn}
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     {stage.date}
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     {stage.dateCn}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={cn(
//                     "text-sm",
//                     stage.status === 'Eligible' ? "text-green-500" : stage.status === 'Ended' ? "text-gray-400" : "text-gray-500"
//                   )}>
//                     {stage.status === 'Eligible' ? '正在进行' : stage.status === 'Ended' ? '已结束' : '未进行'}
//                   </span>
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
// const getCurrentStageIndex = () => {
//     const currentIndex = stages.findIndex((stage, index) => {
//         const nextStage = stages[index + 1]
//         if (!nextStage) return true
//         return currentTimestamp >= stage.timestamp && currentTimestamp < nextStage.timestamp
//     })
//     return Math.max(0, currentIndex)
// }

{/* <div className="flex items-center justify-between">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your email"
                />
                {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
            </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    className={cn(
                        "w-full py-3 rounded-lg font-medium transition-all",
                        isBeforeAllStages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                    )}
                    onClick={handleParticipate}
                    disabled={isBeforeAllStages}
                >
                    参与
                </button>
            </div> */}

{/* <h2 className="text-2xl font-bold">AirDrop</h2> */ }
{/* {currentStage?.title === "Claim Stage" ? (
                <div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter your Token ID"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <input
                            type="text"
                            value={merkProof}
                            onChange={(e) => setMerkProof(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter your MerkProof"
                        />
                    </div>
                
                    <div className="flex items-center justify-between mt-4">
                        <button
                            className={cn(
                                "w-full py-3 rounded-lg font-medium transition-all",
                                currentStage?.status === 'Eligible' ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"
                            )}
                            onClick={handleParticipate}
                            disabled={currentStage?.status !== 'Eligible'}
                        >
                            Claim Airdrop
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter your email"
                        />
                    </div>
                    {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            className={cn(
                                "w-full py-3 rounded-lg font-medium transition-all",
                                isBeforeAllStages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                            )}
                            onClick={handleParticipate}
                            disabled={isBeforeAllStages}
                        >
                            Participate
                        </button>
                    </div>
                </div>
                
            )} */}




import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import axios from 'axios';
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldEventHistory,useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { soliditySha3 } from "web3-utils";
import { MerkleTree } from "merkletreejs";
import { isAddress } from "viem"; // 使用 wagmi 的地址验证函数
import Image from "next/image"
import AwardScroller from "../_components/adropSchedule";
export const cn = (...args: (string | undefined | false | null)[]): string => {
    return args.filter(Boolean).join(' ')
};

interface AirDropProps {
    address: string;  // 声明 status 的类型
}

interface Stage {
    title: string
    titleCn: string
    date: string
    dateCn: string
    timestamp: number
    status: 'Not eligible' | 'Eligible' | 'Ended'
}

export const AirdropSchedule: React.FC<AirDropProps> = ({ address }) => {
    const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { address: connectedAddress } = useAccount();  // Get connected Ethereum address
    const [tokenId, setTokenId] = useState('')
    const [merkProof, setMerkProof] = useState('')
    const [distributeAmount, setDistributeAmount] = useState('')
    // const [leaves, setLeaves] = useState<string[]>([]); // 用于存储所有叶子节点
    // const [proofs, setProofs] = useState<Record<string, string[]> | null>(null);
    // const [merkleRoot, setMerkleRoot] = useState<string | null>(null);
    const [sellerData, setSellerData] = useState([]);
    const [airList, setAirList] = useState([]);
    const [airTimeData, setAirTimeData] = useState([]);
    // const [mintedTokenIds, setMintedTokenIds] = useState<number[]>([]);

    const [addresses, setAddresses] = useState<string[]>([]);
    const [step, setStep] = useState<number>(1); // 表示当前步骤
    // 获取合约实例
    const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
    

     const { data: mintedTokenIds } = useScaffoldReadContract({
        contractName: "YourCollectible",
        functionName: "getAllDropTokenIds",
        watch: true,
      });
    


      
    // const {
    //     data: events,
    //     // isLoading: isLoadingEvents,
    //     // error: errorReadingEvents,
    // } = useScaffoldEventHistory({
    //     contractName: "YourCollectible", // The contract name
    //     eventName: "NftAirDroped", // Event name emitted by the mintBatch function
    //     fromBlock: 0n, // Starting block number to watch for events (adjust accordingly)
    //     watch: true, // Set to true if you want to listen for real-time events
    //     // filters: {}, // Any additional filters can be applied here (e.g., to filter by a specific sender)
    //     blockData: true,
    //     transactionData: true,
    //     receiptData: true,
    // });

    // useEffect(() => {
    //     fetchNftData();
    //     handleAirdropList()
    //     if (events) {
    //         // console.log("Fetched events:", events);
    //         // You can now process the fetched events as needed
    //         // For example, each event will contain the `mintedTokenIds`
    //         events.forEach(event => {
    //             const mintedTokenIds = event.args.mintedTokenIds;
    //             if (mintedTokenIds) {
    //                 const tokenIds = mintedTokenIds.map(id => Number(id)); // Convert to number[]
    //                 // console.log(tokenIds)
    //                 setMintedTokenIds(tokenIds);
    //             }
    //         });
    //     }
    // }, [events]);


  
    // useEffect(() => {
    //     fetchNftData();
    //     if (events) {

    //         events.forEach(event => {
    //             const mintedTokenIds = event.args.mintedTokenIds;
    //             if (mintedTokenIds) {
    //                 const tokenIds = mintedTokenIds.map(id => Number(id)); 
    //                 setMintedTokenIds(tokenIds);
    //                 const imagesurl = [];

    //                 mintedTokenIds.forEach(async (tokenId) => {
    //                     try {
    //                         const { data: tokenURI } = useScaffoldReadContract({
    //                             contractName: "YourCollectible",
    //                             functionName: "tokenURI",
    //                             args: [BigInt(tokenId)],
    //                         });
    //                         console.log(tokenURI)
    //                         const imageUrl = await getMetadataFromIPFS(tokenURI as string);
    //                         imagesurl.push(imageUrl.image);
    //                         console.log(imageUrl)
    //                     } catch (error) {
    //                         console.error(`Failed to fetch tokenURI for tokenId ${tokenId}:`, error);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // }, [events]);



    //空投时间设置
    const fetchNftData = async () => {
        try {
            // const response = await axios.post("http://127.0.0.1:8080/nftUser/getAirDropSetTime"); 
            
            const response = await axios.post('http://127.0.0.1:8080/nftUser/getAirDropSetTime', {
                droperaddress: address,
            })
            if (response.data) {
                setAirTimeData(response.data);
            }
        } catch (error) {
            console.error("Error fetching NFT data:", error);
            // Optionally handle the error (e.g., show an error message to the user)
        }
    };

    // console.log(airTimeData[0]?.startTime)

    function formatDate(timestamp: string | number, locale: string): string {
        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            console.error('Invalid timestamp:', timestamp);
            return 'Invalid Date'; // Return a default string if the timestamp is invalid
        }

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    const stages: Stage[] = [
        {
            title: "Participation Stage",
            titleCn: "参与空投阶段",
            date: formatDate(airTimeData[0]?.startTime, "en-US"),  // Dynamic date based on timestamp
            dateCn: formatDate(airTimeData[0]?.startTime, "zh-CN"),
            timestamp: new Date(airTimeData[0]?.startTime).getTime(),
            status: 'Not eligible' // Default status
        },
        {
            title: "Claim Stage",
            titleCn: "领取空投阶段",
            date: airTimeData[0]?.dropTime ? formatDate(airTimeData[0]?.dropTime, "en-US") : 'Invalid Date',
            dateCn: airTimeData[0]?.dropTime ? formatDate(airTimeData[0]?.dropTime, "zh-CN") : 'Invalid Date',
            timestamp: new Date(airTimeData[0]?.dropTime).getTime(),
            status: 'Not eligible'
        },
        {
            title: "End Stage",
            titleCn: "结束空投阶段",
            date: airTimeData[0]?.endTime ? formatDate(airTimeData[0]?.endTime, "en-US") : 'Invalid Date',
            dateCn: airTimeData[0]?.endTime ? formatDate(airTimeData[0]?.endTime, "zh-CN") : 'Invalid Date',
            timestamp: new Date(airTimeData[0]?.endTime).getTime(),
            status: 'Not eligible'
        }
    ]

    useEffect(() => {
        handleAirdropList();
        fetchNftData();
    }, [mintedTokenIds])


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTimestamp(Date.now())
        }, 1000)

        return () => clearInterval(timer)
    }, [])



    const getCurrentStageIndex = () => {

        const currentIndex = stages.findIndex((stage, index) => {
            const nextStage = stages[index + 1];
            if (!nextStage) {
                // console.log(`Next stage does not exist for stage: ${stage.title}`);
                return currentTimestamp >= stage.timestamp;
            }
            const isInRange = currentTimestamp >= stage.timestamp && currentTimestamp < nextStage.timestamp;
            // console.log(`Checking stage: ${stage.title}, In range: ${isInRange}`);
            return isInRange;
        });

        // console.log('Found Current Stage Index:', currentIndex);
        return currentIndex === -1 ? -1 : Math.max(0, currentIndex);
    }


    // 判断是否所有阶段都未开始，如果是，跳过所有阶段的节点颜色设置
    const isBeforeAllStages = currentTimestamp < Math.min(...stages.map(stage => stage.timestamp))

    // 动态更新每个阶段的状态
    const updateStageStatus = () => {
        if (isBeforeAllStages) {
            // 如果当前时间小于所有阶段的时间戳，所有状态设置为 'Not eligible'
            return stages.map(stage => ({ ...stage, status: 'Not eligible' }))
        }

        return stages.map((stage, index) => {
            if (currentTimestamp < stage.timestamp) {
                // 阶段未开始
                return { ...stage, status: 'Not eligible' }
            }
            const nextStage = stages[index + 1]
            if (nextStage && currentTimestamp < nextStage.timestamp) {
                // 阶段正在进行
                return { ...stage, status: 'Eligible' }
            }
            // 阶段已结束
            return { ...stage, status: 'Ended' }
        })
    }

    // 获取已更新的阶段
    const updatedStages = updateStageStatus()
    const currentStageIndex = getCurrentStageIndex()
    // console.log(currentStageIndex)
    const currentStage = updatedStages[currentStageIndex]

    //邮箱验证
    const validateEmail = (email: string) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        return emailPattern.test(email)
    }


    // Handle participation button click
    const handleParticipate = async () => {
        const currentTimestamp = Date.now();
        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.')
            return
        }
        setErrorMessage('');
        try {
            const response = await axios.post('http://127.0.0.1:8080/nftUser/airdrop', {
                address: connectedAddress,
                email: email,
                timestamp: currentTimestamp,
                period: airTimeData[0]?.period,
                droperaddress: address,
            })
            if (response.data) {
                alert(response.data)
                window.location.reload();
            }
        } catch (error) {
            console.error('Error participating in airdrop:', error)
        }
    }

    const handleClaimAirdrop = async () => {
        // Logic to claim airdrop with tokenId and merkProof
        if (!tokenId || !merkProof) {
            setErrorMessage('Please enter both Token ID and MerkProof.');
            return;
        }
        try {

            const merkProof1: string[] = merkProof.split(',');

            const merkProofBytes32 = merkProof1 as `0x${string}`[];
            await writeContractAsync({
                functionName: "drawAirDrop",
                args: [BigInt(tokenId), merkProofBytes32, address as `0x${string}`],
            });
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        }
    };

    // const handleDistributeAirdrop = async () => {
    //     try {
    //         const response = await axios.post("http://127.0.0.1:8080/nftUser/airDropUser", {
    //             distributeAmount: distributeAmount,
    //         }); // Send GET request to the backend
    //         if (response.data) {
    //             console.log(response.data)
    //             setSellerData(response.data);

    //         }
    //     } catch (error) {
    //         console.error("Error fetching NFT data:", error);
    //     }

    // };


    const handleDistributeAirdrop = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8080/nftUser/airDropUser", {
                distributeAmount: mintedTokenIds?.length,
                period: airTimeData[0]?.period,
                droperaddress: address,
            });
            setSellerData(response.data);
            if (Array.isArray(response.data)) {
                // Iterate through each item in the response array
                response.data.forEach(item => {
                    const { address } = item;

                    // // Validate if the address is a valid Ethereum address
                    if (isAddress(address)) {
                    setAddresses((prevAddresses) => [...prevAddresses, address]);
                    } else {
                        alert("无效的以太坊地址: " + address);
                    }
                });
            } else {
                console.error("Expected array format but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching NFT data:", error);
        }

    };



    const handleAirdropList = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8080/nftUser/getAirDropList", {
                period: airTimeData[0]?.period,
                droperaddress: address,
            });
 
            setAirList(response.data);
        } catch (error) {
            console.error("Error fetching NFT data:", error);
        }

    };


    // 生成 Merkle Tree
    const generateMerkleTree = async () => {
        if (addresses.length === 0) {
            alert("地址列表为空，无法生成 Merkle Tree");
            return;
        }
        if (mintedTokenIds?.length === 0) {
            alert("还没创建空投nft");
            return;
        }

        // 随机打乱 mintedTokenIds 和 addresses 数组
        const shuffledAddresses = [...addresses];
        const shuffledTokenIds = [...(mintedTokenIds as bigint[])]; // Type assertion


        // 随机打乱数组
        for (let i = shuffledAddresses.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledAddresses[i], shuffledAddresses[j]] = [shuffledAddresses[j], shuffledAddresses[i]];
        }

        for (let i = shuffledTokenIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTokenIds[i], shuffledTokenIds[j]] = [shuffledTokenIds[j], shuffledTokenIds[i]];
        }

        // 配对地址和 tokenId
        const generatedLeaves = shuffledAddresses.map((addr, index) => {
            const tokenId = shuffledTokenIds[index]; // 使用随机打乱后的 tokenId
            console.log(addr)

            const leaf = soliditySha3(
                { type: "address", value: addr },
                { type: "uint256", value: String(tokenId) }
            );
            return leaf;
        });


     
        // 创建 Merkle Tree
        const tree = new MerkleTree(generatedLeaves, soliditySha3, { sortPairs: true });
        // 获取 Merkle Root
        const root = tree.getHexRoot();
      
        // 将 Merkle Root 写入合约
        await writeContractAsync({
            functionName: "setMerkleProofRoot",
            args: [root as `0x${string}`],
        });
        // 生成每个地址的 Merkle Proof
        const generatedProofs: Record<string, string[]> = {};
        shuffledAddresses.forEach(async (addr, index) => {
            const tokenId = shuffledTokenIds[index];
            const tokenIdStr = tokenId.toString(); // Ensure tokenId is a string
            const leaf = soliditySha3(
                { type: "address", value: addr },
                { type: "uint256", value: String(tokenIdStr) }
            ) as string;
            const proof = tree.getHexProof(leaf);
            generatedProofs[`${addr}-${tokenIdStr}`] = proof;
            // Send data to backend
            console.log(addr)
            const response = await axios.post('http://127.0.0.1:8080/nftUser/addAirList', {
                address: addr,
                tokenId: tokenIdStr,
                leafHash: leaf,
                merkleProof: generatedProofs[`${addr}-${tokenIdStr}`],
                period: airTimeData[0]?.period,
                droperaddress: address,
            });
            alert(response.data);
        });


    };


    return (
        // <div className="flex flex-col items-center w-full">
        //         <h1
        //             style={{
        //                 fontSize: '3rem',
        //                 textAlign: 'center',
        //                 fontWeight: 'bold',
        //                 color: '#333',
        //                 fontFamily: 'Arial, sans-serif',
        //             }}
        //         >
        //             第{airTimeData[0]?.period}期空投
        //         </h1>
        //     <div
        //         style={{
        //             display: 'flex',
        //             flexDirection: 'column',
        //             alignItems: 'flex-start', // 改为 'flex-start' 让内容向左对齐
        //             width: '62.3%',
        //             marginLeft: '-890px', // 添加左边距，调整整体位置
        //         }}
        //     >

        //         <h1 style={{ margin: '20px' }}>获得空投名单</h1>
        //         <AwardScroller airList={airList} /> {/* 将 airList 传递给 AwardScroller 组件 */}
        //     </div>
        //     <div className="space-y-4  w-[100%]">

        //         <div className="flex">
        //             <div className="w-1/4 flex">
        //                 <Image
        //                     src="/drop.jpg"
        //                     alt="NFT Preview"
        //                     width={700}
        //                     height={600}
        //                     className="rounded-lg"
        //                 />
        //             </div>
        //             <div className="w-1/4 pl-8">
        //                 {currentStage?.title === "Claim Stage" ? (
        //                     <div>
        //                         <div className="flex items-center justify-between">
        //                             <input
        //                                 type="text"
        //                                 value={tokenId}
        //                                 onChange={(e) => setTokenId(e.target.value)}
        //                                 className="w-full p-2 border rounded-lg"
        //                                 placeholder="Enter your Token ID"
        //                             />
        //                         </div>
        //                         <div className="flex items-center justify-between mt-4">
        //                             <input
        //                                 type="text"
        //                                 value={merkProof}
        //                                 onChange={(e) => setMerkProof(e.target.value)}
        //                                 className="w-full p-2 border rounded-lg"
        //                                 placeholder="Enter your MerkProof"
        //                             />
        //                         </div>
        //                         {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        //                         <div className="flex items-center justify-between mt-4">
        //                             <button
        //                                 className={cn(
        //                                     "w-full py-3 rounded-lg font-medium transition-all",
        //                                     currentStage?.status === 'Eligible' ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"
        //                                 )}
        //                                 onClick={handleClaimAirdrop}
        //                                 disabled={currentStage?.status !== 'Eligible'}
        //                             >
        //                                 Claim Airdrop
        //                             </button>
        //                         </div>
        //                     </div>
        //                 ) : currentStage?.title === "Participation Stage" ? (
        //                     <div>
        //                         <div className="flex items-center justify-between">
        //                             <input
        //                                 type="email"
        //                                 value={email}
        //                                 onChange={(e) => setEmail(e.target.value)}
        //                                 className="w-full p-2 border rounded-lg"
        //                                 placeholder="Enter your email"
        //                             />
        //                         </div>
        //                         {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
        //                         <div className="flex items-center justify-between mt-4">
        //                             <button
        //                                 className={cn(
        //                                     "w-full py-3 rounded-lg font-medium transition-all",
        //                                     isBeforeAllStages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
        //                                 )}
        //                                 onClick={handleParticipate}
        //                                 disabled={isBeforeAllStages}
        //                             >
        //                                 Participate
        //                             </button>
        //                         </div>
        //                     </div>
        //                 ) : currentStage?.title === "End Stage" ? (
        //                     <div>
        //                         <p className="text-sm text-gray-500">The AirDrop has ended.</p>
        //                         <button
        //                             className="w-full py-3 mt-4 rounded-lg font-medium bg-gray-500 text-white cursor-not-allowed"
        //                             disabled
        //                         >
        //                             AirDrop Ended
        //                         </button>
        //                     </div>
        //                 ) : null}

        //                 <span className="text-xl font-medium">
        //                     {currentStageIndex === -1
        //                         ? '当前阶段: 未开始'
        //                         : `当前阶段: ${updatedStages[currentStageIndex].title}`}
        //                 </span>
        //                 <div className="relative">
        //                     {updatedStages.map((stage, index) => {
        //                         const isCurrentStage = getCurrentStageIndex() === index
        //                         const isNextStage = getCurrentStageIndex() === index - 1;

        //                         const stageIsActive = isBeforeAllStages ? false : isCurrentStage

        //                         return (
        //                             <div key={index} className="relative">
        //                                 <div className="flex items-center gap-4 py-4">
        //                                     <div className="relative">
        //                                         <div
        //                                             className={cn(
        //                                                 "w-4 h-4 rounded-full border-2 z-10 relative bg-background",
        //                                                 stageIsActive ? "border-primary" : "border-gray-300"
        //                                             )}
        //                                         >
        //                                             {stageIsActive && (
        //                                                 <div className="absolute inset-1 rounded-full bg-primary" />
        //                                             )}
        //                                         </div>
        //                                         {index !== updatedStages.length - 1 && (
        //                                             <div className={cn(
        //                                                 "absolute top-4 left-2 w-[1px] h-[185px] -translate-x-1/2",
        //                                                 isNextStage ? "bg-primary" : "bg-gray-300"
        //                                             )} />
        //                                         )}
        //                                     </div>
        //                                     <div className="flex-1">
        //                                         <p className="font-medium">
        //                                             {stage.title}
        //                                         </p>
        //                                         <p className="font-medium">
        //                                             {stage.titleCn}
        //                                         </p>
        //                                         <p className="text-gray-500 text-sm">
        //                                             {stage.date}
        //                                         </p>
        //                                         <p className="text-gray-500 text-sm">
        //                                             {stage.dateCn}
        //                                         </p>
        //                                     </div>
        //                                     <div className="flex items-center gap-2">
        //                                         <span className={cn(
        //                                             "text-sm",
        //                                             stage.status === 'Eligible' ? "text-green-500" : stage.status === 'Ended' ? "text-gray-400" : "text-gray-500"
        //                                         )}>
        //                                             {stage.status === 'Eligible' ? '正在进行' : stage.status === 'Ended' ? '已结束' : '未进行'}
        //                                         </span>
        //                                         <ChevronDown className="h-4 w-4 text-gray-500" />
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         )
        //                     })}
        //                 </div>
        //             </div>
        //         </div>



        //         {currentStage?.title === "Claim Stage" && connectedAddress === address && (
        //             <div className="flex gap-8">

        //                 {step === 1 && (
        //                     <div className="w-1/4 p-4">
        //                         <table className="min-w-full table-auto border-collapse">
        //                             <thead>
        //                                 <tr>
        //                                     <th className="border-b p-2">用户地址</th>
        //                                     <th className="border-b p-2">用户邮箱</th>
        //                                     <th className="border-b p-2">用户参时间</th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 {sellerData.map((seller, index) => (
        //                                     <tr key={index}>
        //                                         <td className="border-b p-2">{seller.address}</td>
        //                                         <td className="border-b p-2">{seller.email}</td>
        //                                         <td className="border-b p-2">{new Date(seller.timestamp).toLocaleString()}</td>
        //                                     </tr>
        //                                 ))}
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 )}

        //                 {step === 1 && (
        //                     <div className="w-1/5 p-4">
        //                         <div className="w-full">
        //                             <h3 className="text-lg font-semibold">Distribute Airdrop</h3>
        //                             {/* <input
        //                             type="text"
        //                             value={distributeAmount}
        //                             onChange={(e) => setDistributeAmount(e.target.value)}
        //                             className="w-full p-2 border rounded-lg"
        //                             placeholder="Amount to distribute"
        //                         /> */}
        //                             {/* {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>} */}
        //                             <button
        //                                 onClick={handleDistributeAirdrop}
        //                                 className="mt-4 w-[50%] py-3 rounded-lg font-medium bg-green-500 text-white"
        //                             >
        //                                 获取被空投用户
        //                             </button>
        //                             <button
        //                                 onClick={() => setStep(2)} style={{ padding: "10px" }}
        //                                 className="mt-4 w-[50%] py-3 rounded-lg font-medium bg-green-500 text-white"
        //                             >
        //                                 下一步
        //                             </button>
        //                         </div>

        //                     </div>
        //                 )}

        //                 {/* {step === 2 && (
        //                 <div className="w-2/3 p-4">
        //                     <table className="min-w-full table-auto border-collapse">
        //                         <thead>
        //                             <tr>
        //                                 <th className="border-b p-2">用户地址</th>
        //                                 <th className="border-b p-2">空投NFTID</th>
        //                                 <th className="border-b p-2">leafHash</th>
        //                                 <th className="border-b p-2">merkleProof</th>
        //                             </tr>
        //                         </thead>
        //                         <tbody>
        //                             {airList.map((airList, index) => (
        //                                 <tr key={index}>
        //                                     <td className="border-b p-2">{airList.address}</td>
        //                                     <td className="border-b p-2">{airList.tokenId}</td>
        //                                     <td className="border-b p-2">{airList.leafHash}</td>
        //                                     <td className="border-b p-2">{airList.merkleProof}</td>
        //                                 </tr>
        //                             ))}
        //                         </tbody>
        //                     </table>
        //                 </div>
        //             )} */}

        //                 {step === 2 && (
        //                     <div className="w-1/3 p-4">

        //                         <div className="w-full">
        //                             <h3 className="text-lg font-semibold">AirDropList</h3>
        //                             <button
        //                                 onClick={generateMerkleTree}
        //                                 className="mt-4 w-full py-3 rounded-lg font-medium bg-green-500 text-white"
        //                             >
        //                                 发送空投
        //                             </button>
        //                             <button onClick={() => setStep(1)} style={{ padding: "10px" }}>
        //                                 上一步
        //                             </button>
        //                         </div>

        //                     </div>
        //                 )}
        //             </div>
        //         )}
        //         {/* <div className="w-2/3 p-4">
        //         <table className="min-w-full table-auto border-collapse">
        //             <thead>
        //                 <tr>
        //                     <th className="border-b p-2">用户地址</th>
        //                     <th className="border-b p-2">空投NFTID</th>
        //                     <th className="border-b p-2">leafHash</th>
        //                     <th className="border-b p-2">merkleProof</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {airList.map((airList, index) => (
        //                     <tr key={index}>
        //                         <td className="border-b p-2">{airList.address}</td>
        //                         <td className="border-b p-2">{airList.tokenId}</td>
        //                         <td className="border-b p-2">{airList.leafHash}</td>
        //                         <td className="border-b p-2">{airList.merkleProof}</td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     </div> */}

        //     </div>

        // </div>
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Centered title section */}
                <div className="flex justify-center mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-gray-800">
                        第{airTimeData[0]?.period}期空投
                    </h1>

                </div>
                {/* Award Scroller positioned directly under the title */}
                <AwardScroller airList={airList} />
                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Left column - Image */}
                    <div className="relative aspect-square lg:aspect-auto">
                        <Image
                            src="/drop.jpg"
                            alt="NFT Preview"
                            fill
                            className="rounded-lg object-cover"
                            priority
                        />
                    </div>

                    {/* Right column - Form and Stages */}
                    <div className="space-y-6">
                        {/* Form Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            {currentStage?.title === "Claim Stage" ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={tokenId}
                                        onChange={(e) => setTokenId(e.target.value)}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Enter your Token ID"
                                    />
                                    <input
                                        type="text"
                                        value={merkProof}
                                        onChange={(e) => setMerkProof(e.target.value)}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Enter your MerkProof"
                                    />
                                    {errorMessage && (
                                        <div className="text-red-500 text-sm">{errorMessage}</div>
                                    )}
                                    <button
                                        className={cn(
                                            "w-full p-4 rounded-lg font-medium transition-all text-white",
                                            currentStage?.status === 'Eligible'
                                                ? "bg-blue-500 hover:bg-blue-600"
                                                : "bg-gray-300 cursor-not-allowed"
                                        )}
                                        onClick={handleClaimAirdrop}
                                        disabled={currentStage?.status !== 'Eligible'}
                                    >
                                        Claim Airdrop
                                    </button>
                                </div>
                            ) : currentStage?.title === "Participation Stage" ? (
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Enter your email"
                                    />
                                    {errorMessage && (
                                        <div className="text-red-500 text-sm">{errorMessage}</div>
                                    )}
                                    <button
                                        className={cn(
                                            "w-full p-4 rounded-lg font-medium transition-all text-white",
                                            isBeforeAllStages
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                        )}
                                        onClick={handleParticipate}
                                        disabled={isBeforeAllStages}
                                    >
                                        Participate
                                    </button>
                                </div>
                            ) : currentStage?.title === "End Stage" ? (
                                <div className="space-y-4">
                                    <p className="text-gray-500">The AirDrop has ended.</p>
                                    <button
                                        className="w-full p-4 rounded-lg font-medium bg-gray-500 text-white cursor-not-allowed"
                                        disabled
                                    >
                                        AirDrop Ended
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        {/* Stages Timeline */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <span className="text-xl font-medium block mb-6">
                                {currentStageIndex === -1
                                    ? '当前阶段: 未开始'
                                    : `当前阶段: ${updatedStages[currentStageIndex].title}`}
                            </span>
                            <div className="space-y-2">
                                {updatedStages.map((stage, index) => {
                                    const isCurrentStage = getCurrentStageIndex() === index;
                                    const isNextStage = getCurrentStageIndex() === index - 1;
                                    const stageIsActive = isBeforeAllStages ? false : isCurrentStage;

                                    return (
                                        <div key={index} className="relative">
                                            <div className="flex items-start gap-4 py-4">
                                                <div className="relative">
                                                    <div
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border-2 z-10 relative bg-background",
                                                            stageIsActive ? "border-primary" : "border-gray-300"
                                                        )}
                                                    >
                                                        {stageIsActive && (
                                                            <div className="absolute inset-1 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                    {index !== updatedStages.length - 1 && (
                                                        <div
                                                            className={cn(
                                                                "absolute top-4 left-2 w-[1px] h-[calc(100%+11rem)] -translate-x-1/2",
                                                                isNextStage ? "bg-primary" : "bg-gray-300"
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="font-medium">{stage.title}</p>
                                                            <p className="font-medium">{stage.titleCn}</p>
                                                            <p className="text-sm text-gray-500">{stage.date}</p>
                                                            <p className="text-sm text-gray-500">{stage.dateCn}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span
                                                                className={cn(
                                                                    "text-sm whitespace-nowrap",
                                                                    stage.status === 'Eligible'
                                                                        ? "text-green-500"
                                                                        : stage.status === 'Ended'
                                                                            ? "text-gray-400"
                                                                            : "text-gray-500"
                                                                )}
                                                            >
                                                                {stage.status === 'Eligible'
                                                                    ? '正在进行'
                                                                    : stage.status === 'Ended'
                                                                        ? '已结束'
                                                                        : '未进行'}
                                                            </span>
                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Section */}
                {currentStage?.title === "Claim Stage" && connectedAddress === address && (
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {step === 1 && (
                            <>
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户地址</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户邮箱</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户参时间</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {sellerData.map((seller, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{seller.address}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{seller.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(seller.timestamp).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                                        <h3 className="text-lg font-semibold">Distribute Airdrop</h3>
                                        <div className="space-y-4">
                                            <button
                                                onClick={handleDistributeAirdrop}
                                                className="w-full py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
                                            >
                                                获取被空投用户
                                            </button>
                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
                                            >
                                                下一步
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                                    <h3 className="text-lg font-semibold">AirDropList</h3>
                                    <button
                                        onClick={generateMerkleTree}
                                        className="w-full py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
                                    >
                                        发送空投
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full py-3 rounded-lg font-medium bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors"
                                    >
                                        上一步
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>


    )
}
export default AirdropSchedule;











































// <div>
// {/* 左侧表格 */}
// <div className="w-1/2 p-4">
//     <table className="min-w-full table-auto border-collapse">
//         <thead>
//             <tr>
//                 <th className="border-b p-2">用户地址</th>
//                 <th className="border-b p-2">用户邮箱</th>
//                 <th className="border-b p-2">用户参时间</th>
//             </tr>
//         </thead>
//         <tbody>
//             {sellerData.map((seller, index) => (
//                 <tr key={index}>
//                     <td className="border-b p-2">{seller.address}</td>
//                     <td className="border-b p-2">{seller.email}</td>
//                     <td className="border-b p-2">{new Date(seller.timestamp).toLocaleString()}</td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// </div>

// {/* 右侧内容 */}
// <div className="w-1/2 p-4">
//     {currentStage?.title === "Claim Stage" && connectedAddress === address && (
//         <div className="w-full">
//             <h3 className="text-lg font-semibold">Distribute Airdrop</h3>
//             <input
//                 type="text"
//                 value={distributeAmount}
//                 onChange={(e) => setDistributeAmount(e.target.value)}
//                 className="w-full p-2 border rounded-lg"
//                 placeholder="Amount to distribute"
//             />
//             {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
//             <button
//                 onClick={handleDistributeAirdrop}
//                 className="mt-4 w-full py-3 rounded-lg font-medium bg-green-500 text-white"
//             >
//                 获取被空投用户
//             </button>
//         </div>
//     )}
// </div>
// </div>



// <div>
// <div className="w-1/2 f" >
// <Image
//   src="/placeholder.svg?height=600&width=600"
//   alt="NFT Preview"
//   width={600}
//   height={600}
//   className="rounded-lg"
// />
// </div>
//     {currentStage?.title === "Claim Stage" ? (
//         <div>
//             <div className="flex items-center justify-between">
//                 <input
//                     type="text"
//                     value={tokenId}
//                     onChange={(e) => setTokenId(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                     placeholder="Enter your Token ID"
//                 />
//             </div>
//             <div className="flex items-center justify-between mt-4">
//                 <input
//                     type="text"
//                     value={merkProof}
//                     onChange={(e) => setMerkProof(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                     placeholder="Enter your MerkProof"
//                 />
//             </div>
//             {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
//             <div className="flex items-center justify-between mt-4">
//                 <button
//                     className={cn(
//                         "w-full py-3 rounded-lg font-medium transition-all",
//                         currentStage?.status === 'Eligible' ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"
//                     )}
//                     onClick={handleClaimAirdrop}
//                     disabled={currentStage?.status !== 'Eligible'}
//                 >
//                     Claim Airdrop
//                 </button>
//             </div>
//         </div>
//     ) : currentStage?.title === "Participation Stage" ? (
//         <div>
//             <div className="flex items-center justify-between">
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                     placeholder="Enter your email"
//                 />
//             </div>
//             {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
//             <div className="flex items-center justify-between mt-4">
//                 <button
//                     className={cn(
//                         "w-full py-3 rounded-lg font-medium transition-all",
//                         isBeforeAllStages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
//                     )}
//                     onClick={handleParticipate}
//                     disabled={isBeforeAllStages}
//                 >
//                     Participate
//                 </button>
//             </div>
//         </div>
//     ) : currentStage?.title === "End Stage" ? (
//         <div>
//             <p className="text-sm text-gray-500">The AirDrop has ended.</p>
//             <button
//                 className="w-full py-3 mt-4 rounded-lg font-medium bg-gray-500 text-white cursor-not-allowed"
//                 disabled
//             >
//                 AirDrop Ended
//             </button>
//         </div>
//     ) : null}

//     <span className="text-xl font-medium">
//         {currentStageIndex === -1
//             ? '当前阶段: 未开始'
//             : `当前阶段: ${updatedStages[currentStageIndex].title}`}
//     </span>
//     <div className="relative">
//         {updatedStages.map((stage, index) => {
//             const isCurrentStage = getCurrentStageIndex() === index
//             //   const isPastStage = currentTimestamp > stage.timestamp
//             const isNextStage = getCurrentStageIndex() === index - 1;

//             // Add this check to avoid highlighting nodes if all stages haven't started
//             const stageIsActive = isBeforeAllStages ? false : isCurrentStage

//             return (
//                 <div key={index} className="relative">
//                     <div className="flex items-center gap-4 py-4">
//                         <div className="relative">
//                             <div
//                                 className={cn(
//                                     "w-4 h-4 rounded-full border-2 z-10 relative bg-background",
//                                     stageIsActive ? "border-primary" : "border-gray-300"
//                                 )}
//                             >
//                                 {stageIsActive && (
//                                     <div className="absolute inset-1 rounded-full bg-primary" />
//                                 )}
//                             </div>
//                             {index !== updatedStages.length - 1 && (
//                                 <div className={cn(
//                                     "absolute top-4 left-2 w-[1px] h-[185px] -translate-x-1/2",
//                                     isNextStage ? "bg-primary" : "bg-gray-300"
//                                 )} />
//                             )}
//                         </div>
//                         <div className="flex-1">
//                             <p className="font-medium">
//                                 {stage.title}
//                             </p>
//                             <p className="font-medium">
//                                 {stage.titleCn}
//                             </p>
//                             <p className="text-gray-500 text-sm">
//                                 {stage.date}
//                             </p>
//                             <p className="text-gray-500 text-sm">
//                                 {stage.dateCn}
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <span className={cn(
//                                 "text-sm",
//                                 stage.status === 'Eligible' ? "text-green-500" : stage.status === 'Ended' ? "text-gray-400" : "text-gray-500"
//                             )}>
//                                 {stage.status === 'Eligible' ? '正在进行' : stage.status === 'Ended' ? '已结束' : '未进行'}
//                             </span>
//                             <ChevronDown className="h-4 w-4 text-gray-500" />
//                         </div>
//                     </div>
//                 </div>
//             )
//         })}
//     </div>
// </div>
