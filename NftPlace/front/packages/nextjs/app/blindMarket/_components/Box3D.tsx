// import { useRef, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei'; // Import useGLTF to load 3D models
// import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// // 3D盒子组件
// const Box3D = ({ isOpened, stopRotation, resetRotation, rotationAngle }) => {
//   const boxRef = useRef(null);
//   const { scene } = useGLTF('/3DModel/scene.gltf');
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   // 控制盒子的旋转
//   useFrame(() => {
//     if (boxRef.current && isOpened && !stopRotation) {
//       boxRef.current.rotation.y += 0.05; // 动画旋转
//     }
//   });

//   // 如果需要重置旋转
//   if (boxRef.current && resetRotation) {
//     boxRef.current.rotation.y = rotationAngle; // 重置旋转角度为指定角度
//   }

//   return (
//     <mesh ref={boxRef} position={[0, 0, 0]} rotation={[0, rotationAngle, 0]}> {/* 设置旋转角度 */}
//       <primitive object={scene} scale={[1.4, 1.4, 1.4]} /> {/* 增大模型 */}
//     </mesh>
//   );
// };

// // 主页面组件
// const BoxOpeningPage = () => {
//   const [isOpened, setIsOpened] = useState(false);  // 控制开箱状态
//   const [stopRotation, setStopRotation] = useState(false);  // 控制旋转停止
//   const [prize, setPrize] = useState(null);  // 存储中奖信息
//   const [showOpenButton, setShowOpenButton] = useState(true);  // 控制开箱按钮显示
//   const [resetRotation, setResetRotation] = useState(false); // 控制是否重置旋转
//   const [rotationAngle, setRotationAngle] = useState(Math.PI / 4); // 初始旋转角度为45度

//   // 开始开箱
//   const handleOpenBox = () => {
//     setIsOpened(true); // 开启旋转
//     setStopRotation(false); // 开启旋转
//     setPrize(null); // 清除之前的奖品信息
//     setShowOpenButton(false); // 隐藏开箱按钮
//     setResetRotation(false); // 不重置旋转，保持旋转
//     setRotationAngle(Math.PI / 4); // 设定开箱时的旋转角度

//     // 模拟随机抽奖
//     setTimeout( async() => {
//       try {
//         await writeContractAsync({
//           functionName: "purchaseNft",
//           args: [BigInt(nft.tokenId)],
//           value: priceInWei,
//           nonce: 0,
//       });
//       // const prizes = ['iPhone', 'MacBook', 'iPad', 'AirPods'];
//       // const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
//       setPrize(randomPrize); // 设置中奖的奖品
//       setStopRotation(true); // 停止旋转
//       }catch (error) {
//         console.error("Error purchasing NFT:", error);
//       }
//     }, 2000);  // 3秒后抽奖结束
//   };
//   // 关闭抽奖并重置状态
//   const handleClosePrize = () => {
//     setIsOpened(false); // 重置为未开启状态
//     setStopRotation(true); // 停止旋转
//     setPrize(null); // 清除奖品
//     setShowOpenButton(true); // 显示开箱按钮
//     setResetRotation(true); // 开启旋转重置
//     setRotationAngle(Math.PI / 4); // 保持旋转角度（类似于“关闭”的初始状态）
//   };
//   return (
//     <div style={{ height: '500px', width: '100%', position: 'relative' }}>
//       {/* 使用 Canvas 渲染 3D 内容 */}
//       <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[2, 5, 2]} />
//         {/* 传递 isOpened, stopRotation, resetRotation 状态到 Box3D 组件 */}
//         <Box3D
//           isOpened={isOpened}
//           stopRotation={stopRotation}
//           resetRotation={resetRotation}
//           rotationAngle={rotationAngle} // 传递当前旋转角度
//         />
//         <OrbitControls />
//       </Canvas>
//       {/* 按钮，点击后触发开箱 */}
//       {showOpenButton && (
//         <button
//           style={{
//             position: 'absolute',
//             top: '95%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             padding: '10px 20px',
//             fontSize: '16px',
//             backgroundColor: '#f4a261',
//             color: 'white',
//             border: 'none',
//             cursor: 'pointer',
//             borderRadius: '10px',
//           }}
//           onClick={handleOpenBox}
//         >
//           开箱
//         </button>
//       )}

//       {/* 标题 */}
//       <h1
//         style={{
//           textAlign: 'center',
//           marginTop: '20px',
//           fontSize: '36px',
//           color: '#264653',
//         }}
//       >
//         3D 盲盒抽奖
//       </h1>

//       {/* 盲盒开箱后的提示 */}
//       {prize && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             fontSize: '12px',
//             color: '#2a9d8f',
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             padding: '20px',
//             borderRadius: '10px',
//             width: '400px', // 增大宽度
//             height: '550px', // 增大高度
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 添加阴影增强视觉效果
//           }}
//         >
//           <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
//             <figure className="relative">
//               {/* <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" /> */}
//             </figure>

//           </div>

//           {/* 关闭按钮 */}
//           <button
//             onClick={handleClosePrize}
//             style={{
//               position: 'absolute', // 将按钮的定位设置为绝对
//               bottom: '10px',      // 距离父容器底部 10px
//               right: '10px',       // 距离父容器右边 10px
//               padding: '10px 10px',
//               backgroundColor: '#e76f51',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer',
//               marginTop: '5px',
//               borderRadius: '5px', // 增加按钮圆角
//             }}
//           >
//             关闭
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
// export default BoxOpeningPage;



// import { useRef, useState,useEffect} from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// // 3D盒子组件
// const Box3D = ({ isOpened, stopRotation, resetRotation, rotationAngle }) => {
//   const boxRef = useRef(null);
//   const { scene } = useGLTF('/3DModel/scene.gltf');

//   // 控制盒子的旋转
//   useFrame(() => {
//     if (boxRef.current && isOpened && !stopRotation) {
//       boxRef.current.rotation.y += 0.05; // 动画旋转
//     }
//   });

//   // 如果需要重置旋转
//   if (boxRef.current && resetRotation) {
//     boxRef.current.rotation.y = rotationAngle; // 重置旋转角度为指定角度
//   }

//   return (
//     <mesh ref={boxRef} position={[0, 0, 0]} rotation={[0, rotationAngle, 0]}>
//       <primitive object={scene} scale={[1.4, 1.4, 1.4]} />
//     </mesh>
//   );
// };

// // 主页面组件
// const BoxOpeningPage = () => {
//   const [isOpened, setIsOpened] = useState(false);
//   const [stopRotation, setStopRotation] = useState(false);
//   const [prizeId, setPrizeId] = useState(0);
//   const [showOpenButton, setShowOpenButton] = useState(true);
//   const [resetRotation, setResetRotation] = useState(false);
//   const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const [loading, setLoading] = useState(true);



//   const { data: nft } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getNftItem",
//     args: [BigInt(prizeId)],
//   });



//   useEffect(() => {
//     const fetchMetadata = async () => {
//       try {
//         const fetchedMetadata = await getMetadataFromIPFS(nft?.tokenUri as string);
//         setMetadata(fetchedMetadata);
//       } catch (error) {
//         console.error(`Error fetching metadata for tokenId ${nft?.tokenId}:`, error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMetadata();
//   }, [nft?.tokenUri]);



//   // 重置状态的函数
//   const resetBoxState = () => {
//     setIsOpened(false);
//     setStopRotation(true);
//     setPrizeId(0);
//     setShowOpenButton(true);
//     setResetRotation(true);
//     setRotationAngle(Math.PI / 4);
//   };

//   // 开始开箱
//   const handleOpenBox = () => {
//     setIsOpened(true);
//     setStopRotation(false);
//     setPrizeId(0);
//     setShowOpenButton(false);
//     setResetRotation(false);
//     setRotationAngle(Math.PI / 4);

//     setTimeout(async () => {
//       try {
//         const tokenId = await writeContractAsync({
//           functionName: "buyMysteryBox",
//           value: parseEther("0.1"),
//         });

//         if (tokenId) {
//           setPrizeId(Number(tokenId));
//           setStopRotation(true);
//         } else {
//           console.warn("No tokenId returned. Resetting box state.");
//           resetBoxState();
//         }
//       } catch (error) {
//         console.error("Error purchasing NFT:", error);
//         resetBoxState();
//       }
//     }, 2000);
//   };

//   // 关闭抽奖并重置状态
//   const handleClosePrize = () => {
//     resetBoxState();
//   };

//   return (
//     <div style={{ height: '500px', width: '100%', position: 'relative' }}>
//       {/* 使用 Canvas 渲染 3D 内容 */}
//       <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[2, 5, 2]} />
//         <Box3D
//           isOpened={isOpened}
//           stopRotation={stopRotation}
//           resetRotation={resetRotation}
//           rotationAngle={rotationAngle}
//         />
//         <OrbitControls />
//       </Canvas>

//       {/* 按钮，点击后触发开箱 */}
//       {showOpenButton && (
//         <button
//           style={{
//             position: 'absolute',
//             top: '95%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             padding: '10px 20px',
//             fontSize: '16px',
//             backgroundColor: '#f4a261',
//             color: 'white',
//             border: 'none',
//             cursor: 'pointer',
//             borderRadius: '10px',
//           }}
//           onClick={handleOpenBox}
//         >
//           开箱
//         </button>
//       )}

//       {/* 标题 */}
//       <h1
//         style={{
//           textAlign: 'center',
//           marginTop: '20px',
//           fontSize: '36px',
//           color: '#264653',
//         }}
//       >
//         3D 盲盒抽奖
//       </h1>

//       {/* 盲盒开箱后的提示 */}
//       {prizeId && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             fontSize: '12px',
//             color: '#2a9d8f',
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//             padding: '20px',
//             borderRadius: '10px',
//             width: '400px',
//             height: '550px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           }}
//         >
//           <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
//             <figure className="relative">
//               <img src={metadata.image} alt="NFT Image" className="h-60 min-w-full" />
//             </figure>
//           </div>

//           {/* 关闭按钮 */}
//           <button
//             onClick={handleClosePrize}
//             style={{
//               position: 'absolute',
//               bottom: '10px',
//               right: '10px',
//               padding: '10px 10px',
//               backgroundColor: '#e76f51',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer',
//               marginTop: '5px',
//               borderRadius: '5px',
//             }}
//           >
//             关闭
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
// export default BoxOpeningPage;


// import { useRef, useState, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import * as THREE from "three";
// import { useScaffoldWriteContract, useScaffoldContract, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";
// import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";


// interface BidProps {
//   address: string;  // 声明 status 的类型
// }

// interface Box3DProps {
//   isOpened: boolean;
//   stopRotation: boolean;
//   resetRotation: boolean;
//   rotationAngle: number;
// }

// const Box3D: React.FC<Box3DProps> = ({ isOpened, stopRotation, resetRotation, rotationAngle }) => {
//   const boxRef = useRef<THREE.Mesh>(null);
//   const { scene } = useGLTF("/3DModel/scene.gltf");

//   useFrame(() => {
//     if (boxRef.current) {
//       if (resetRotation) {
//         boxRef.current.rotation.y = rotationAngle;
//       } else if (isOpened && !stopRotation) {
//         boxRef.current.rotation.y += 0.05;
//       }
//     }
//   });

//   return (
//     <mesh ref={boxRef} position={[0, 0, 0]} rotation={[0, rotationAngle, 0]}>
//       <primitive object={scene} scale={[0.7, 0.7, 0.7]} /> {/* Scale down the box model */}
//     </mesh>
//   );
// };

// const BoxOpeningPage: React.FC<BidProps> = ({ address }) => {
//   const [isOpened, setIsOpened] = useState(false);
//   const [stopRotation, setStopRotation] = useState(false);
//   const [prizeId, setPrizeId] = useState<bigint>(BigInt(0));
//   const [showOpenButton, setShowOpenButton] = useState(true);
//   const [resetRotation, setResetRotation] = useState(false);
//   const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
//   const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });

//   useScaffoldWatchContractEvent({
//     contractName: "YourCollectible",
//     eventName: "BuyMysteryBox",
//     onLogs: logs => {
//       logs.map(log => {
//         const { tokenId, buyer } = log.args;
//         setPrizeId(tokenId as bigint);
//         setStopRotation(true);
//       });
//     },
//   });

//   useEffect(() => {
//     const fetchMetadata = async (): Promise<void> => {
//       if (yourCollectibleContract === undefined) return;
//       try {
//         const tokenURI = await yourCollectibleContract.read.tokenURI([BigInt(prizeId)]);
//         const fetchedMetadata = await getMetadataFromIPFS(tokenURI as string);
//         setMetadata(fetchedMetadata);
//       } catch (error) {
//         console.error(`Error fetching metadata for tokenId ${prizeId}:`, error);
//       }
//     };
//     fetchMetadata();
//   }, [prizeId]);

//   const resetBoxState = () => {
//     setIsOpened(false);
//     setStopRotation(true);
//     setPrizeId(BigInt(0));
//     setShowOpenButton(true);
//     setResetRotation(true);
//     setRotationAngle(Math.PI / 4);
//   };

//   const handleOpenBox = () => {
//     setIsOpened(true);
//     setStopRotation(false);
//     setPrizeId(BigInt(0));
//     setShowOpenButton(false);
//     setResetRotation(false);
//     setRotationAngle(Math.PI / 4);

//     setTimeout(async () => {
//       try {
//         await writeContractAsync({
//           functionName: "buyMysteryBox",
//           args: [address as `0x${string}`],
//           value: parseEther("1"),
//         });
//       } catch (error) {
//         console.error("Error purchasing NFT:", error);
//         resetBoxState();
//       }
//     }, 2000);
//   };

//   const handleClosePrize = () => {
//     resetBoxState();
//   };

//   return (
//     <div style={{ height: "350px", width: "20%", position: "relative" }}>
//       <Canvas
//         camera={{ position: [0, 0, 3], fov: 50 }} 
//         style={{ background: "transparent" }}     
//         gl={{ alpha: true }}                        
//       >
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[2, 5, 2]} />
//         <Box3D
//           isOpened={isOpened}
//           stopRotation={stopRotation}
//           resetRotation={resetRotation}
//           rotationAngle={rotationAngle}
//         />
//         <OrbitControls />
//       </Canvas>
//       {showOpenButton && (
//         <button
//           style={{
//             position: "absolute",
//             top: "95%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             padding: "10px 20px",
//             fontSize: "16px",
          
//             color: "black",
//             border: "2px solid gray",
//             cursor: "pointer",
//             borderRadius: "10px",
//           }}
//           onClick={handleOpenBox}
//         >
//           开箱
//         </button>
//       )}
//       {prizeId !== BigInt(0) && (
//         <div
//           style={{
//             position: "absolute",
//             top: "40%",
//             left: "55%",
//             transform: "translate(-50%, -50%)",
//             fontSize: "12px",
//             color: "#2a9d8f",
//             backgroundColor: "rgba(255, 255, 255, 0.8)",
//             padding: "20px",
//             borderRadius: "10px",
//             width: "340px",
//             height: "320px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//           }}
//         >
//           <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
//             <figure className="relative">
//               <img src={metadata.image} alt="NFT Image" className="h-60 min-w-full" />
//             </figure>
//           </div>
//           <button
//             onClick={handleClosePrize}
//             style={{
//               position: "absolute",
//               bottom: "10px",
//               right: "10px",
//               padding: "10px 10px",
//               backgroundColor: "#e76f51",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               marginTop: "5px",
//               borderRadius: "10px",
//             }}
//           >
//             关闭
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BoxOpeningPage;

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScaffoldWriteContract, useScaffoldContract, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

interface BidProps {
  address: string;
}

interface Box3DProps {
  isOpened: boolean;
  stopRotation: boolean;
  resetRotation: boolean;
  rotationAngle: number;
}

const Box3D: React.FC<Box3DProps> = ({ isOpened, stopRotation, resetRotation, rotationAngle }) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF("/3DModel/scene.gltf");

  useFrame(() => {
    if (boxRef.current) {
      if (resetRotation) {
        boxRef.current.rotation.y = rotationAngle;
      } else if (isOpened && !stopRotation) {
        boxRef.current.rotation.y += 0.05;
      }
    }
  });

  return (
    <mesh ref={boxRef} position={[0, 0, 0]} rotation={[0, rotationAngle, 0]}>
      <primitive object={scene} scale={[0.7, 0.7, 0.7]} />
    </mesh>
  );
};

const BoxOpeningPage: React.FC<BidProps> = ({ address }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [stopRotation, setStopRotation] = useState(false);
  const [prizeId, setPrizeId] = useState<bigint>(BigInt(0));
  const [showOpenButton, setShowOpenButton] = useState(true);
  const [resetRotation, setResetRotation] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
  const [metadata, setMetadata] = useState<Partial<NFTMetaData>>({});
  const [isPrizeShown, setIsPrizeShown] = useState(false); // 新增状态

  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

  const { data: yourCollectibleContract } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  useScaffoldWatchContractEvent({
    contractName: "YourCollectible",
    eventName: "BuyMysteryBox",
    onLogs: logs => {
      logs.map(log => {
        const { tokenId, buyer } = log.args;
        setPrizeId(tokenId as bigint);
        setStopRotation(true);
        setIsPrizeShown(true); // 设置奖品框显示
      });
    },
  });

  useEffect(() => {
    const fetchMetadata = async (): Promise<void> => {
      if (yourCollectibleContract === undefined || prizeId === BigInt(0)) return;
      try {
        const tokenURI = await yourCollectibleContract.read.tokenURI([BigInt(prizeId)]);
        const fetchedMetadata = await getMetadataFromIPFS(tokenURI as string);
        setMetadata(fetchedMetadata);
      } catch (error) {
        console.error(`Error fetching metadata for tokenId ${prizeId}:`, error);
      }
    };
    fetchMetadata();
  }, [prizeId]);

  const resetBoxState = () => {
    setIsOpened(false);
    setStopRotation(true);
    setPrizeId(BigInt(0));
    setShowOpenButton(true);
    setResetRotation(true);
    setRotationAngle(Math.PI / 4);
    setIsPrizeShown(false); // 重置奖品框显示状态
  };

  const handleOpenBox = () => {
    setIsOpened(true);
    setStopRotation(false);
    setPrizeId(BigInt(0));
    setShowOpenButton(false);
    setResetRotation(false);
    setRotationAngle(Math.PI / 4);

    setTimeout(async () => {
      try {
        await writeContractAsync({
          functionName: "buyMysteryBox",
          args: [address as `0x${string}`],
          value: parseEther("1"),
        });
      } catch (error) {
        console.error("Error purchasing NFT:", error);
        resetBoxState();
      }
    }, 2000);
  };

  const handleClosePrize = () => {
    setIsPrizeShown(false); // 手动关闭奖品框
  };

  return (
    <div style={{ height: "350px", width: "20%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} />
        <Box3D
          isOpened={isOpened}
          stopRotation={stopRotation}
          resetRotation={resetRotation}
          rotationAngle={rotationAngle}
        />
        <OrbitControls />
      </Canvas>
      {showOpenButton && (
        <button
          style={{
            position: "absolute",
            top: "95%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px 20px",
            fontSize: "16px",
            color: "black",
            border: "2px solid gray",
            cursor: "pointer",
            borderRadius: "10px",
          }}
          onClick={handleOpenBox}
        >
          开箱
        </button>
      )}
      {isPrizeShown && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            color: "#2a9d8f",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            width: "340px",
            height: "320px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
            <figure className="relative">
              <img src={metadata.image} alt="NFT Image" className="h-60 min-w-full" />
            </figure>
          </div>
          <button
            onClick={handleClosePrize}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              padding: "10px 10px",
              backgroundColor: "#e76f51",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "5px",
              borderRadius: "10px",
            }}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};

export default BoxOpeningPage;