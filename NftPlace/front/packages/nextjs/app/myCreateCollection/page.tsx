//原来得

  "use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

// Pinata configuration
const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export default function CreateNFT() {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    image: "",
  });

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
          image: imageUrl,
        }));
        console.log(imageUrl)
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
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validTypes.includes(file.type)) {
        handleImageUpload(file);
      } else {
        notification.error("Invalid file type. Please upload an image.");
      }
    }
  };

  const handleMintItem = async () => {
    const metadata = {
      name: nftData.name,
      description: nftData.description,
      image: nftData.image,
    };

    const notificationId = notification.loading("Uploading to IPFS");

    try {
      const cid = await addToIPFS(metadata);
      notification.remove(notificationId);
      notification.success("Metadata uploaded to IPFS");

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, cid],
      });

      resetForm();
    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
    }
  };

  const resetForm = () => {
    setNftData({
      name: "",
      description: "",
      image: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNftData({
      ...nftData,
      [e.target.name]: e.target.value,
    });
  };


  const handleRemoveImage = () => {
    setNftData((prevData) => ({
      ...prevData,
      image: "",
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <a href="/CreateCollection">
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </a>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>Create</h1>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            border: '2px dashed #e2e8f0',
            borderRadius: '0.5rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            backgroundColor: 'white'
          }}>
            {nftData.image ? (
              // <img
              //   src={nftData.image}
              //   alt="NFT Preview"
              //   style={{
              //     maxWidth: '100%',
              //     height: 'auto',
              //     borderRadius: '0.5rem',
              //     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              //   }}
              // />
              <div style={{ position: 'relative', width: '100%', maxWidth: '100%', height: 'auto' }}>
              <img
                src={nftData.image}
                alt="NFT Preview"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <button
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: 'white' }}
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ maxWidth: '240px' }}>
                  <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>Choose file</p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280'
                  }}>Upload your NFT image. Supports JPG, PNG and GIF.</p>
                </div>
                <label style={{
                  cursor: 'pointer',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontWeight: '500'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  Select File
                </label>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>NFT Details</h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '1.5rem'
              }}>
                Fill in the details for your new NFT. These details will be permanently stored in the blockchain.
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={nftData.name}
                  onChange={handleInputChange}
                  placeholder="Enter NFT name"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #D1D5DB'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={nftData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your NFT"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #D1D5DB',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ paddingTop: '1rem' }}>
                <button
                  onClick={handleMintItem}
                  disabled={!nftData.image || !nftData.name}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: nftData.image && nftData.name ? '#3B82F6' : '#9CA3AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontWeight: '500',
                    cursor: nftData.image && nftData.name ? 'pointer' : 'not-allowed'
                  }}
                >
                  Create NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useAccount } from "wagmi";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { generateThumbnail } from './utils/thumbnailGenerator';
// import { HandThumbUpIcon } from "@heroicons/react/20/solid";
// const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// export default function CreateNFT() {
//   const { address: connectedAddress } = useAccount();
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [nftData, setNftData] = useState({
//     name: "",
//     description: "",
//     image: "",
//     external_url: "",
//   });


//   useEffect(() => {
//     if (!nftData.image || !nftData.image.includes("/ipfs/")) return;

//     const canvas = canvasRef.current;
//     if (!canvas) {
//       console.error("Canvas element is not available.");
//       return;
//     }
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('#272727');
//     const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);

//     // 创建一个白色的 HemisphereLight，模拟明亮的环境光
//     const light = new THREE.HemisphereLight(0xffffff, 0x444444, 10);

//     light.position.set(0, 20, 0);
//     scene.add(light);

//     const loader = new GLTFLoader();
//     loader.load(
//       nftData.image,
//       (gltf) => {
//         const model = gltf.scene;
//         scene.add(model);

//         model.position.set(0, 0, 0);
//         model.scale.set(1, 1, 1);

//         // Center the camera on the model
//         const box = new THREE.Box3().setFromObject(model);
//         const center = box.getCenter(new THREE.Vector3());
//         const size = box.getSize(new THREE.Vector3());

//         const maxDim = Math.max(size.x, size.y, size.z);
//         const fov = camera.fov * (Math.PI / 180);
//         let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2;

//         camera.position.set(center.x, center.y, center.z + cameraZ);
//         camera.lookAt(center);

//         // Add orbit controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.target.set(center.x, center.y, center.z);
//         controls.update();

//         // Animate
//         const animate = () => {
//           requestAnimationFrame(animate);
//           controls.update();
//           renderer.render(scene, camera);
//         };
//         animate();
//       },
//       undefined,
//       (error) => console.error("Error loading model", error)
//     );

//     return () => {
//       // Cleanup the three.js context
//       renderer.dispose();
//     };
//   }, [nftData.image]);


//   async function uploadThumbnailToPinata(base64Image: string): Promise<string | null> {
//     // Convert the base64 string to a Blob
//     const byteCharacters = atob(base64Image.split(',')[1]); // Remove the "data:image/png;base64," part
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
//       const slice = byteCharacters.slice(offset, offset + 1024);
//       const byteNumbers = new Array(slice.length);

//       for (let i = 0; i < slice.length; i++) {
//         byteNumbers[i] = slice.charCodeAt(i);
//       }

//       const byteArray = new Uint8Array(byteNumbers);
//       byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type: 'image/png' });

//     // Prepare FormData for uploading the image
//     const formData = new FormData();
//     formData.append('file', blob);
//     formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
//     formData.append('pinataMetadata', JSON.stringify({
//       name: 'thumbnail.png',
//       keyvalues: { fileType: 'png' },
//     }));

//     try {
//       // Upload to Pinata
//       const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${pinataJWT}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.IpfsHash) {
//         // Get the IPFS URL
//         const modelUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//         console.log('Uploaded Thumbnail URL:', modelUrl);
//         return modelUrl; // You can use this URL to display or store it
//       } else {
//         console.error('Error uploading image:', data);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     }
//   }



//   const handleModelUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
//     formData.append("pinataMetadata", JSON.stringify({
//       name: file.name,
//       keyvalues: { fileType: "glb" },
//     }));
//     try {
//       const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${pinataJWT}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.IpfsHash) {
//         const modelUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//         // console.log(modelUrl)
//         setNftData((prevData) => ({
//           ...prevData,
//           image: modelUrl,
//         }));
//         const thumbnailDataUrl = await generateThumbnail(modelUrl);
//         const thumbnailimage = await uploadThumbnailToPinata(thumbnailDataUrl)
//         if(!thumbnailimage) return;
//         setNftData((prevData) => ({
//           ...prevData,
//           external_url: thumbnailimage,
//         }));
//         notification.success("3D model uploaded successfully!");
//       } else {
//         notification.error("Failed to upload 3D model.");
//       }


//     } catch (error) {
//       console.error("Error uploading 3D model:", error);
//       notification.error("Error uploading 3D model.");
//     }
//   };


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const validTypes = ["model/gltf-binary"];
//       if (validTypes.includes(file.type) || file.name.endsWith('.glb')) {
//         handleModelUpload(file);
//       } else {
//         notification.error("Invalid file type. Please upload a .glb file.");
//       }
//     }
//   };

//   const handleMintItem = async () => {
//     const metadata = {
//       name: nftData.name,
//       description: nftData.description,
//       image: nftData.image,
//       external_url:nftData.external_url,
//     };

//     const notificationId = notification.loading("Uploading to IPFS");

//     try {
//       const cid = await addToIPFS(metadata);
//       notification.remove(notificationId);
//       notification.success("Metadata uploaded to IPFS");

//       await writeContractAsync({
//         functionName: "mintItem",
//         args: [connectedAddress, cid],
//       });

//       resetForm();
//     } catch (error) {
//       notification.remove(notificationId);
//       console.error(error);
//     }
//   };

//   const resetForm = () => {
//     setNftData({
//       name: "",
//       description: "",
//       image: "",
//       external_url: ""
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setNftData({
//       ...nftData,
//       [e.target.name]: e.target.value,
//     });
//   };


//   const handleRemoveImage = () => {
//     setNftData((prevData) => ({
//       ...prevData,
//       image: "",
//     }));
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f9f9f9',
//       padding: '2rem',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           marginBottom: '2rem'
//         }}>
//           <a href="/CreateCollection">
//             <button style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               marginRight: '1rem'
//             }}>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </button>
//           </a>
//           <h1 style={{
//             fontSize: '2.5rem',
//             fontWeight: 'bold'
//           }}>Create</h1>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//           gap: '2rem'
//         }}>
//           <div style={{
//             border: '2px dashed #e2e8f0',
//             borderRadius: '0.5rem',
//             padding: '2rem',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '400px',
//             backgroundColor: 'white'
//           }}>
//             {nftData.image ? (
//               <div style={{ position: "relative", width: "100%", height: "400px" }}>
//                 <canvas
//                   ref={canvasRef}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     borderRadius: "0.5rem",
//                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                   }}
//                 />
//                 <button
//                   onClick={handleRemoveImage}
//                   style={{
//                     position: "absolute",
//                     top: "10px",
//                     right: "10px",
//                     backgroundColor: "rgba(0, 0, 0, 0.5)",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "50%",
//                     width: "24px",
//                     height: "24px",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                     style={{ color: "white" }}
//                   >
//                     <path
//                       d="M18 6L6 18M6 6L18 18"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ) : (
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 gap: '1rem',
//                 textAlign: 'center'
//               }}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M12 5V19M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 <div style={{ maxWidth: '240px' }}>
//                   <p style={{
//                     fontSize: '1.125rem',
//                     fontWeight: '500',
//                     color: '#111827'
//                   }}>Choose file</p>
//                   <p style={{
//                     fontSize: '0.875rem',
//                     color: '#6B7280'
//                   }}>Upload your NFT 3D model. Supports GLB format.</p>
//                 </div>
//                 <label style={{
//                   cursor: 'pointer',
//                   backgroundColor: '#3B82F6',
//                   color: 'white',
//                   padding: '0.5rem 1rem',
//                   borderRadius: '0.25rem',
//                   fontWeight: '500'
//                 }}>
//                   <input
//                     type="file"
//                     accept=".glb"
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }}
//                   />
//                   Select .glb File
//                 </label>
//               </div>
//             )}
//           </div>

//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '1.5rem'
//           }}>
//             <div>
//               <h2 style={{
//                 fontSize: '1.5rem',
//                 fontWeight: '600',
//                 marginBottom: '0.5rem'
//               }}>NFT Details</h2>
//               <p style={{
//                 fontSize: '0.875rem',
//                 color: '#6B7280',
//                 marginBottom: '1.5rem'
//               }}>
//                 Fill in the details for your new NFT. These details will be permanently stored in the blockchain.
//               </p>
//             </div>

//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '1rem'
//             }}>
//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.25rem'
//                 }}>
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={nftData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter NFT name"
//                   style={{
//                     width: '100%',
//                     padding: '0.5rem',
//                     borderRadius: '0.25rem',
//                     border: '1px solid #D1D5DB'
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{
//                   display: 'block',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   color: '#374151',
//                   marginBottom: '0.25rem'
//                 }}>
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={nftData.description}
//                   onChange={handleInputChange}
//                   placeholder="Describe your NFT"
//                   style={{
//                     width: '100%',
//                     padding: '0.5rem',
//                     borderRadius: '0.25rem',
//                     border: '1px solid #D1D5DB',
//                     minHeight: '120px',
//                     resize: 'vertical'
//                   }}
//                 />
//               </div>

//               <div style={{ paddingTop: '1rem' }}>
//                 <button
//                   onClick={handleMintItem}
//                   disabled={!nftData.image || !nftData.name}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     backgroundColor: nftData.image && nftData.name ? '#3B82F6' : '#9CA3AF',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '0.25rem',
//                     fontWeight: '500',
//                     cursor: nftData.image && nftData.name ? 'pointer' : 'not-allowed'
//                   }}
//                 >
//                   Create NFT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
///修改








































// "use client";

// import { useState } from "react";
// import { useAccount } from "wagmi";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { notification } from "~~/utils/scaffold-eth";
// import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

// // Pinata configuration
// const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// export default function CreateNFT() {
//   const { address: connectedAddress } = useAccount();
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

//   const [nftData, setNftData] = useState({
//     name: "",
//     description: "",
//     image: "",
//   });

//   const handleImageUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${pinataJWT}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.IpfsHash) {
//         const imageUrl = `https://indigo-naval-toad-795.mypinata.cloud/ipfs/${data.IpfsHash}`;
//         setNftData((prevData) => ({
//           ...prevData,
//           image: imageUrl,
//         }));
//         notification.success("Image uploaded successfully!");
//       } else {
//         notification.error("Failed to upload image.");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       notification.error("Error uploading image.");
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/gif"];
//       if (validTypes.includes(file.type)) {
//         handleImageUpload(file);
//       } else {
//         notification.error("Invalid file type. Please upload an image.");
//       }
//     }
//   };

//   const handleMintItem = async () => {
//     const metadata = {
//       name: nftData.name,
//       description: nftData.description,
//       image: nftData.image,
//     };

//     const notificationId = notification.loading("Uploading to IPFS");

//     try {
//       const cid = await addToIPFS(metadata);
//       notification.remove(notificationId);
//       notification.success("Metadata uploaded to IPFS");

//       await writeContractAsync({
//         functionName: "mintItem",
//         args: [connectedAddress, cid],
//       });

//       resetForm();
//     } catch (error) {
//       notification.remove(notificationId);
//       console.error(error);
//     }
//   };

//   const resetForm = () => {
//     setNftData({
//       name: "",
//       description: "",
//       image: "",
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setNftData({
//       ...nftData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRemoveImage = () => {
//     setNftData((prevData) => ({
//       ...prevData,
//       image: "",
//     }));
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f9f9f9',
//       padding: '2rem',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           marginBottom: '2rem'
//         }}>
//           <a href="/CreateCollection">
//             <button style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               marginRight: '1rem'
//             }}>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </button>
//           </a>
//           <h1 style={{
//             fontSize: '2.5rem',
//             fontWeight: 'bold'
//           }}>Create</h1>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//           gap: '2rem'
//         }}>
//           <div style={{
//             border: '2px dashed #e2e8f0',
//             borderRadius: '0.5rem',
//             padding: '2rem',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '400px',
//             backgroundColor: 'white'
//           }}>
//             {nftData.image ? (
//               <div style={{ position: 'relative', width: '100%', maxWidth: '100%', height: 'auto' }}>
//                 <img
//                   src={nftData.image}
//                   alt="NFT Preview"
//                   style={{
//                     maxWidth: '100%',
//                     height: 'auto',
//                     borderRadius: '0.5rem',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//                   }}
//                 />
//                 <button
//                   onClick={handleRemoveImage}
//                   style={{
//                     position: 'absolute',
//                     top: '10px',
//                     right: '10px',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '50%',
//                     width: '24px',
//                     height: '24px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                     style={{ color: 'white' }}
//                   >
//                     <path
//                       d="M18 6L6 18M6 6L18 18"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ) : (
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 gap: '1rem',
//                 textAlign: 'center'
//               }}>
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M12 5V19M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 <div style={{ maxWidth: '240px' }}>
//                   <p style={{
//                     fontSize: '1.125rem',
//                     fontWeight: '500',
//                     color: '#111827'
//                   }}>Choose file</p>
//                   <p style={{
//                     fontSize: '0.875rem',
//                     color: '#6B7280'
//                   }}>Upload your NFT image. Supports JPG, PNG and GIF.</p>
//                 </div>
//                 <label style={{
//                   cursor: 'pointer',
//                   backgroundColor: '#3B82F6',
//                   color: 'white',
//                   padding: '0.5rem 1rem',
//                   borderRadius: '0.25rem',
//                   fontWeight: '500'
//                 }}>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }}
//                   />
//                   Select File
//                 </label>
//               </div>
//             )}
//           </div>

//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '1.5rem'
//           }}>
//             <div>
//               <h2 style={{
//                 fontSize: '1.5rem',
//                 fontWeight: '600',
//                 marginBottom: '0.5rem'
//               }}>NFT Details</h2>
//               <p style={{
//                 fontSize: '0.875rem',
//                 color: '#6B7280',
//                 marginBottom: '1.5rem'
//               }}>
//                 Fill in the details for your new NFT. These details will be permanently stored in the blockchain.
//               </p>
//             </div>

//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '1rem'
//             }}>
//               <div style={{ marginBottom: '1rem' }}>
//                 <input
//                   type="text"
//                   name="name"
//                   value={nftData.name}
//                   onChange={handleInputChange}
//                   placeholder="NFT Name"
//                   style={{
//                     padding: '0.75rem',
//                     fontSize: '1rem',
//                     borderRadius: '0.5rem',
//                     border: '1px solid #D1D5DB',
//                     width: '100%'
//                   }}
//                 />
//               </div>
//               <div>
//                 <textarea
//                   name="description"
//                   value={nftData.description}
//                   onChange={handleInputChange}
//                   placeholder="NFT Description"
//                   rows={4}
//                   style={{
//                     padding: '0.75rem',
//                     fontSize: '1rem',
//                     borderRadius: '0.5rem',
//                     border: '1px solid #D1D5DB',
//                     width: '100%',
//                     resize: 'vertical'
//                   }}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleMintItem}
//               style={{
//                 backgroundColor: '#3B82F6',
//                 color: 'white',
//                 padding: '1rem',
//                 fontSize: '1.125rem',
//                 borderRadius: '0.5rem',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 border: 'none'
//               }}
//             >
//               Create NFT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
