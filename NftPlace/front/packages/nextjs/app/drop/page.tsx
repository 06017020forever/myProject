// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { useAccount } from "wagmi";
// import axios from 'axios';
// import { notification } from "~~/utils/scaffold-eth";

// const HomePage: React.FC = () => {
//     const [imageSrc, setImageSrc] = useState<string | null>(null);
//     const [formData, setFormData] = useState({
//         address: '',
//         headImage: '',
//         timestamp: '',
//     });
//     const { address: connectedAddress } = useAccount();  // Get connected Ethereum address

//     // Pinata API JWT token
//     const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;// Replace with your Pinata JWT

//     // Upload image to Pinata
//     const handleImageUpload = async (file: File) => {
//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${pinataJWT}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             if (data.IpfsHash) {
//                 const imageUrl = `https://indigo-naval-toad-795.mypinata.cloud/ipfs/${data.IpfsHash}`;
//                 setImageSrc(imageUrl);  // Set the image URL for preview
//                 return imageUrl; // Return the image URL
//             } else {
//                 notification.error("Failed to upload image to Pinata.");
//             }
//         } catch (error) {
//             console.error("Error uploading image to Pinata:", error);
//             notification.error("Error uploading image.");
//         }

//         return null;
//     };

//     // Handle image file change
//     const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const validTypes = ["image/jpeg", "image/png", "image/gif"];
//             if (validTypes.includes(file.type)) {
//                 const uploadedImageUrl = await handleImageUpload(file); // Upload image to Pinata
//                 if (uploadedImageUrl) {
//                     // Update formData with image URL
//                     setFormData((prevData) => ({
//                         ...prevData,
//                         headImage: uploadedImageUrl,
//                     }));
//                 }
//             } else {
//                 notification.error("Invalid file type. Please upload an image.");
//             }
//         }
//     };

//     // Handle image removal
//     const handleImageRemove = () => {
//         setImageSrc(null); // Reset the image preview
//         setFormData((prevData) => ({
//             ...prevData,
//             headImage: '', // Remove image URL from formData
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (event: React.MouseEvent) => {
//         event.preventDefault();

//         const currentTimestampInMilliseconds = Date.now(); // In milliseconds

//         const updatedFormData = {
//             ...formData,
//             address: connectedAddress || formData.address,
//             timestamp: currentTimestampInMilliseconds,
//         };

//         if (formData.headImage) {
//             try {
//                 // Send the image URL and form data to the backend
//                 const response = await axios.post(
//                     "http://127.0.0.1:8080/nftUser/nftSeller",
//                     updatedFormData,
//                 );
//                 if (response.data === "创建成功") {
//                     window.location.href = "/myNFTs"; // Redirect to another page on success
//                 } else {
//                     console.error("Registration failed:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Error submitting form:", error);
//                 // Optionally, you can show an error message to the user
//             }
//         } else {
//             alert("Please upload an image before proceeding.");
//         }
//     };

//     return (
//         <div
//             style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 padding: "40px",
//                 fontFamily: "Inter, Arial, sans-serif",
//                 color: "#111827",
//                 backgroundColor: "#fff",
//                 minHeight: "100vh",
//                 boxSizing: "border-box",
//             }}
//         >
//             <nav className="mb-8">
//                 <Link
//                     href="/CreateCollection"
//                     className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                 </Link>
//             </nav>

//             {/* Left Section */}
//             <div style={{ maxWidth: "600px" }}>
//                 <h1
//                     style={{
//                         fontSize: "28px",
//                         fontWeight: "bold",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     Let&apos;s create a smart contract for your drop.
//                 </h1>
//                 <p style={{ fontSize: "16px", marginBottom: "32px", color: "#4B5563" }}>
//                     You&apos;ll need to deploy an ERC-721 contract onto the blockchain
//                     before you can create a drop.{" "}
//                     <a
//                         href="#"
//                         style={{
//                             color: "#2563EB",
//                             textDecoration: "none",
//                             fontWeight: "500",
//                         }}
//                     >
//                         What is a contract?
//                     </a>
//                 </p>

//                 {/* Logo Image */}
//                 <div style={{ marginBottom: "32px", position: "relative" }}>
//                     <div
//                         style={{
//                             border: "1px dashed #D1D5DB",
//                             borderRadius: "8px",
//                             padding: "16px",
//                             textAlign: "center",
//                             backgroundColor: "#F9FAFB",
//                             cursor: "pointer",
//                             position: "relative",
//                             width: "100%",
//                             height: "250px", // You can adjust the height as needed
//                             overflow: "hidden", // Ensure image doesn't overflow
//                         }}
//                     >
//                         {imageSrc ? (
//                             <div
//                                 style={{
//                                     position: "relative",
//                                     height: "100%",
//                                     width: "100%",
//                                 }}
//                             >
//                                 <img
//                                     src={imageSrc}
//                                     alt="Uploaded Logo"
//                                     style={{
//                                         objectFit: "cover", // This ensures the image fills the box
//                                         width: "100%",
//                                         height: "100%",
//                                         borderRadius: "8px",
//                                     }}
//                                 />
//                                 <button
//                                     onClick={handleImageRemove}
//                                     style={{
//                                         position: "absolute",
//                                         top: "8px",
//                                         right: "8px",
//                                         backgroundColor: "transparent",
//                                         border: "none",
//                                         color: "#F87171",
//                                         fontSize: "20px",
//                                         cursor: "pointer",
//                                     }}
//                                 >

//                                 </button>
//                             </div>
//                         ) : (
//                             <div>
//                                 <p>No image uploaded</p>
//                             </div>
//                         )}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             style={{
//                                 display: "none",
//                             }}
//                             id="logo-upload"
//                         />
//                         <label
//                             htmlFor="logo-upload"
//                             style={{
//                                 fontSize: "14px",
//                                 color: "#6B7280",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Drag and drop or click to upload
//                         </label>
//                         <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
//                             Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF
//                         </p>
//                     </div>
//                 </div>

//                    <div style={{ marginBottom: "32px", position: "relative" }}>
//                     <div
//                         style={{
//                             border: "1px dashed #D1D5DB",
//                             borderRadius: "8px",
//                             padding: "16px",
//                             textAlign: "center",
//                             backgroundColor: "#F9FAFB",
//                             cursor: "pointer",
//                             position: "relative",
//                             width: "100%",
//                             height: "250px", // You can adjust the height as needed
//                             overflow: "hidden", // Ensure image doesn't overflow
//                         }}
//                     >
//                         {imageSrc ? (
//                             <div
//                                 style={{
//                                     position: "relative",
//                                     height: "100%",
//                                     width: "100%",
//                                 }}
//                             >
//                                 <img
//                                     src={imageSrc}
//                                     alt="Uploaded Logo"
//                                     style={{
//                                         objectFit: "cover", // This ensures the image fills the box
//                                         width: "100%",
//                                         height: "100%",
//                                         borderRadius: "8px",
//                                     }}
//                                 />
//                                 <button
//                                     onClick={handleImageRemove}
//                                     style={{
//                                         position: "absolute",
//                                         top: "8px",
//                                         right: "8px",
//                                         backgroundColor: "transparent",
//                                         border: "none",
//                                         color: "#F87171",
//                                         fontSize: "20px",
//                                         cursor: "pointer",
//                                     }}
//                                 >

//                                 </button>
//                             </div>
//                         ) : (
//                             <div>
//                                 <p>No image uploaded</p>
//                             </div>
//                         )}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             style={{
//                                 display: "none",
//                             }}
//                             id="logo-upload"
//                         />
//                         <label
//                             htmlFor="logo-upload"
//                             style={{
//                                 fontSize: "14px",
//                                 color: "#6B7280",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Drag and drop or click to upload
//                         </label>
//                         <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
//                             Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF
//                         </p>
//                     </div>
//                 </div>

//                 {/* Action Button - Link to another page */}
//                 <div style={{ marginTop: "40px" }}>
//                     <button
//                         onClick={handleSubmit}
//                         style={{
//                             display: "inline-block",
//                             padding: "12px 24px",
//                             backgroundColor: imageSrc ? "#2563EB" : "#D1D5DB", // Disable the button if no image is uploaded
//                             color: "#ffffff",
//                             fontSize: "16px",
//                             fontWeight: "500",
//                             borderRadius: "8px",
//                             textDecoration: "none",
//                             textAlign: "center",
//                             cursor: imageSrc ? "pointer" : "not-allowed", // Change cursor style based on button state
//                             transition: "background-color 0.3s ease",
//                         }}
//                         // Disable the link if no image is uploaded
//                         aria-disabled={!imageSrc}
//                     >
//                         Go to Next Page
//                     </button>
//                 </div>
//             </div>

//             {/* Right Section */}
//             <div
//                 style={{
//                     minWidth: "300px",
//                     padding: "24px",
//                     backgroundColor: "#F9FAFB",
//                     borderRadius: "8px",
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: "20px",
//                         fontWeight: "600",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     Create NFT Collection
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: "14px",
//                         color: "#6B7280",
//                         marginBottom: "32px",
//                     }}
//                 >
//                     Add your NFTs to the collection and start selling!
//                 </p>
//             </div>
//         </div>
//     );
// };

// export defult HomePage;



// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { useAccount } from "wagmi";
// import axios from 'axios';
// import { notification } from "~~/utils/scaffold-eth";

// const HomePage: React.FC = () => {
//     const [imageSrc, setImageSrc] = useState<string | null>(null); // Logo image preview
//     const [backgroundImageSrc, setBackgroundImageSrc] = useState<string | null>(null); // Background image preview
//     const [formData, setFormData] = useState({
//         name: '', // Name input
//         address: '',
//         headImage: '', // Logo image URL
//         backgroundImage: '', // Background image URL
//         timestamp: '',
//     });
//     const { address: connectedAddress } = useAccount(); // Get connected Ethereum address

//     // Pinata API JWT token
//     const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT; // Replace with your Pinata JWT

//     // Upload image to Pinata
//     const handleImageUpload = async (file: File, isBackgroundImage: boolean) => {
//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const response = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${pinataJWT}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             if (data.IpfsHash) {
//                 const imageUrl = `https://indigo-naval-toad-795.mypinata.cloud/ipfs/${data.IpfsHash}`;
//                 if (isBackgroundImage) {
//                     setBackgroundImageSrc(imageUrl); // Set the background image URL
//                     setFormData((prevData) => ({
//                         ...prevData,
//                         backgroundImage: imageUrl, // Update background image in formData
//                     }));
//                 } else {
//                     setImageSrc(imageUrl); // Set the logo image URL
//                     setFormData((prevData) => ({
//                         ...prevData,
//                         headImage: imageUrl, // Update logo image in formData
//                     }));
//                 }
//                 return imageUrl;
//             } else {
//                 notification.error("Failed to upload image to Pinata.");
//             }
//         } catch (error) {
//             console.error("Error uploading image to Pinata:", error);
//             notification.error("Error uploading image.");
//         }

//         return null;
//     };

//     // Handle image file change (for logo and background)
//     const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, isBackgroundImage: boolean) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const validTypes = ["image/jpeg", "image/png", "image/gif"];
//             if (validTypes.includes(file.type)) {
//                 await handleImageUpload(file, isBackgroundImage); // Upload image to Pinata
//             } else {
//                 notification.error("Invalid file type. Please upload an image.");
//             }
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (event: React.MouseEvent) => {
//         event.preventDefault();

//         const currentTimestampInMilliseconds = Date.now(); // In milliseconds

//         const updatedFormData = {
//             ...formData,
//             address: connectedAddress || formData.address,
//             timestamp: currentTimestampInMilliseconds,
//         };

//         if (formData.headImage && formData.backgroundImage && formData.name) {
//             try {
//                 // Send the form data to the backend
//                 const response = await axios.post(
//                     "http://127.0.0.1:8080/nftUser/nftSeller",
//                     updatedFormData,
//                 );
//                 if (response.data === "创建成功") {
//                     window.location.href = "/myNFTs"; // Redirect to another page on success
//                 } else {
//                     console.error("Registration failed:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Error submitting form:", error);
//             }
//         } else {
//             alert("Please fill all fields and upload images before proceeding.");
//         }
//     };

//     return (
//         <div
//             style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 padding: "40px",
//                 fontFamily: "Inter, Arial, sans-serif",
//                 color: "#111827",
//                 backgroundColor: "#fff",
//                 minHeight: "100vh",
//                 boxSizing: "border-box",
//             }}
//         >
//             <nav className="mb-8">
//                 <Link
//                     href="/CreateCollection"
//                     className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                 </Link>
//             </nav>

//             {/* Left Section */}
//             <div style={{ maxWidth: "600px", flex: 1 }}>
//                 <h1
//                     style={{
//                         fontSize: "28px",
//                         fontWeight: "bold",
//                         marginBottom: "16px",
//                     }}
//                 >
//                     Let&apos;s create a smart contract for your drop.
//                 </h1>
//                 <p style={{ fontSize: "16px", marginBottom: "32px", color: "#4B5563" }}>
//                     You&apos;ll need to deploy an ERC-721 contract onto the blockchain
//                     before you can create a drop.{" "}
//                     <a
//                         href="#"
//                         style={{
//                             color: "#2563EB",
//                             textDecoration: "none",
//                             fontWeight: "500",
//                         }}
//                     >
//                         What is a contract?
//                     </a>
//                 </p>

//                 {/* Name Input */}
//                 <div style={{ marginBottom: "32px" }}>
//                     <label
//                         htmlFor="name"
//                         style={{
//                             fontSize: "14px",
//                             color: "#6B7280",
//                             display: "block",
//                             marginBottom: "8px",
//                         }}
//                     >
//                         Your Name
//                     </label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         placeholder="Enter your name"
//                         style={{
//                             width: "100%",
//                             padding: "12px",
//                             fontSize: "14px",
//                             borderRadius: "8px",
//                             border: "1px solid #D1D5DB",
//                         }}
//                     />
//                 </div>

//                 {/* Logo Image Upload */}
//                 <div style={{ marginBottom: "32px", position: "relative" }}>
//                     <div
//                         style={{
//                             border: "1px dashed #D1D5DB",
//                             borderRadius: "8px",
//                             padding: "16px",
//                             textAlign: "center",
//                             backgroundColor: "#F9FAFB",
//                             cursor: "pointer",
//                             position: "relative",
//                             width: "100%",
//                             height: "250px",
//                             overflow: "hidden",
//                         }}
//                     >
//                         {imageSrc ? (
//                             <div
//                                 style={{
//                                     position: "relative",
//                                     height: "100%",
//                                     width: "100%",
//                                 }}
//                             >
//                                 <img
//                                     src={imageSrc}
//                                     alt="Uploaded Logo"
//                                     style={{
//                                         objectFit: "cover",
//                                         width: "100%",
//                                         height: "100%",
//                                         borderRadius: "8px",
//                                     }}
//                                 />
//                             </div>
//                         ) : (
//                             <div>
//                                 <p>No image uploaded</p>
//                             </div>
//                         )}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(event) => handleImageChange(event, false)}
//                             style={{
//                                 display: "none",
//                             }}
//                             id="logo-upload"
//                         />
//                         <label
//                             htmlFor="logo-upload"
//                             style={{
//                                 position: "absolute",
//                                 top: "50%",
//                                 left: "50%",
//                                 transform: "translate(-50%, -50%)",
//                                 fontSize: "16px",
//                                 color: "#6B7280",
//                             }}
//                         >
//                             Upload logo
//                         </label>
//                     </div>
//                 </div>

//                 {/* Background Image Upload */}
//                 <div style={{ marginBottom: "32px", position: "relative" }}>
//                     <div
//                         style={{
//                             border: "1px dashed #D1D5DB",
//                             borderRadius: "8px",
//                             padding: "16px",
//                             textAlign: "center",
//                             backgroundColor: "#F9FAFB",
//                             cursor: "pointer",
//                             position: "relative",
//                             width: "100%",
//                             height: "250px",
//                             overflow: "hidden",
//                         }}
//                     >
//                         {backgroundImageSrc ? (
//                             <div
//                                 style={{
//                                     position: "relative",
//                                     height: "100%",
//                                     width: "100%",
//                                 }}
//                             >
//                                 <img
//                                     src={backgroundImageSrc}
//                                     alt="Uploaded Background"
//                                     style={{
//                                         objectFit: "cover",
//                                         width: "100%",
//                                         height: "100%",
//                                         borderRadius: "8px",
//                                     }}
//                                 />
//                             </div>
//                         ) : (
//                             <div>
//                                 <p>No image uploaded</p>
//                             </div>
//                         )}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(event) => handleImageChange(event, true)}
//                             style={{
//                                 display: "none",
//                             }}
//                             id="background-upload"
//                         />
//                         <label
//                             htmlFor="background-upload"
//                             style={{
//                                 position: "absolute",
//                                 top: "50%",
//                                 left: "50%",
//                                 transform: "translate(-50%, -50%)",
//                                 fontSize: "16px",
//                                 color: "#6B7280",
//                             }}
//                         >
//                             Upload background
//                         </label>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                     }}
//                 >
//                     <button
//                         onClick={handleSubmit}
//                         disabled={!formData.name || !formData.headImage || !formData.backgroundImage}
//                         style={{
//                             backgroundColor: "#6B7280",
//                             color: "#fff",
//                             padding: "12px 24px",
//                             fontSize: "16px",
//                             fontWeight: "600",
//                             borderRadius: "8px",
//                             cursor: "pointer",
//                             opacity: formData.name && formData.headImage && formData.backgroundImage ? 1 : 0.5,
//                         }}
//                     >
//                         Create Your Drop
//                     </button>
//                 </div>
//             </div>
//             {/* Right Section */}
//             <div style={{ maxWidth: "600px", flex: 1 }}>
//                 <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
//                     NFT Drop Preview
//                 </h2>
//                 <p style={{ fontSize: "16px", color: "#4B5563" }}>
//                     Here’s how your NFT drop will appear once created. You can customize it further to fit your collection.
//                 </p>

//                 {/* Conditionally render the NFT preview if both imageSrc and name are provided */}
//                 {(imageSrc && formData.name) && (
//                     <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", marginTop: "32px" }}>
//                         <img
//                             src={imageSrc}
//                             alt="NFT Logo Preview"
//                             style={{
//                                 objectFit: "cover",
//                                 width: "100%",
//                                 height: "300px",
//                                 borderRadius: "8px",
//                             }}
//                         />
//                         <div style={{ padding: "16px" }}>
//                             <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
//                                 {formData.name}
//                             </h3>
//                             <p style={{ fontSize: "14px", color: "#6B7280" }}>
//                                 NFT Drop
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//         </div>
//     );
// };

// export default HomePage;



"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import axios from 'axios';
import { notification } from "~~/utils/scaffold-eth";

const HomePage: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null); // Logo image preview
    const [backgroundImageSrc, setBackgroundImageSrc] = useState<string | null>(null); // Background image preview
    const [formData, setFormData] = useState({
        name: '', // Name input
        address: '',
        headImage: '', // Logo image URL
        backgroundImage: '', // Background image URL
        timestamp: '',
    });
    const { address: connectedAddress } = useAccount(); // Get connected Ethereum address

    // Pinata API JWT token
    const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT; // Replace with your Pinata JWT

    // Upload image to Pinata
    const handleImageUpload = async (file: File, isBackgroundImage: boolean) => {
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
                const imageUrl = `https://indigo-naval-toad-795.mypinata.cloud/ipfs/${data.IpfsHash}`;
                if (isBackgroundImage) {
                    setBackgroundImageSrc(imageUrl); // Set the background image URL
                    setFormData((prevData) => ({
                        ...prevData,
                        backgroundImage: imageUrl, // Update background image in formData
                    }));
                } else {
                    setImageSrc(imageUrl); // Set the logo image URL
                    setFormData((prevData) => ({
                        ...prevData,
                        headImage: imageUrl, // Update logo image in formData
                    }));
                }
                return imageUrl;
            } else {
                notification.error("Failed to upload image to Pinata.");
            }
        } catch (error) {
            console.error("Error uploading image to Pinata:", error);
            notification.error("Error uploading image.");
        }

        return null;
    };

    // Handle image file change (for logo and background)
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, isBackgroundImage: boolean) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (validTypes.includes(file.type)) {
                await handleImageUpload(file, isBackgroundImage); // Upload image to Pinata
            } else {
                notification.error("Invalid file type. Please upload an image.");
            }
        }
    };

    // Handle image removal
    const handleImageRemove = (isBackgroundImage: boolean) => {
        if (isBackgroundImage) {
            setBackgroundImageSrc(null);
            setFormData((prevData) => ({ ...prevData, backgroundImage: '' }));
        } else {
            setImageSrc(null);
            setFormData((prevData) => ({ ...prevData, headImage: '' }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();

        const currentTimestampInMilliseconds = Date.now(); // In milliseconds

        const updatedFormData = {
            ...formData,
            address: connectedAddress || formData.address,
            timestamp: currentTimestampInMilliseconds,
        };

        if (formData.headImage && formData.backgroundImage && formData.name) {
            try {
                // Send the form data to the backend
                const response = await axios.post(
                    "http://127.0.0.1:8080/nftUser/nftSeller",
                    updatedFormData,
                );
                if (response.data === "创建成功") {
                    window.location.href = "/myNFTs"; // Redirect to another page on success
                } else {
                    console.error("Registration failed:", response.data);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        } else {
            alert("Please fill all fields and upload images before proceeding.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "40px",
                fontFamily: "Inter, Arial, sans-serif",
                color: "#111827",
                backgroundColor: "#fff",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            <nav className="mb-8">
                <Link
                    href="/CreateCollection"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
            </nav>

            {/* Left Section */}
            <div style={{ maxWidth: "600px", flex: 1 }}>
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        marginBottom: "16px",
                    }}
                >
                    Let&apos;s create a smart contract for your drop.
                </h1>
                <p style={{ fontSize: "16px", marginBottom: "32px", color: "#4B5563" }}>
                    You&apos;ll need to deploy an ERC-721 contract onto the blockchain
                    before you can create a drop.{" "}
                    <a
                        href="#"
                        style={{
                            color: "#2563EB",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        What is a contract?
                    </a>
                </p>

                {/* Name Input */}
                <div style={{ marginBottom: "32px" }}>
                    <label
                        htmlFor="name"
                        style={{
                            fontSize: "14px",
                            color: "#6B7280",
                            display: "block",
                            marginBottom: "8px",
                        }}
                    >
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "14px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                        }}
                    />
                </div>

                {/* Logo Image Upload */}
                <div style={{ marginBottom: "32px", position: "relative" }}>
                    <div
                        style={{
                            border: "1px dashed #D1D5DB",
                            borderRadius: "8px",
                            padding: "16px",
                            textAlign: "center",
                            backgroundColor: "#F9FAFB",
                            cursor: "pointer",
                            position: "relative",
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                        }}
                    >
                        {imageSrc ? (
                            <div
                                style={{
                                    position: "relative",
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <img
                                    src={imageSrc}
                                    alt="Uploaded Logo"
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                                <button
                                    onClick={() => handleImageRemove(false)}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            !imageSrc && (
                                <label
                                    htmlFor="logo-upload"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "16px",
                                        color: "#6B7280",
                                    }}
                                >
                                    Upload logo
                                </label>
                            )
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleImageChange(event, false)}
                            id="logo-upload"
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                {/* Background Image Upload */}
                <div style={{ marginBottom: "32px", position: "relative" }}>
                    <div
                        style={{
                            border: "1px dashed #D1D5DB",
                            borderRadius: "8px",
                            padding: "16px",
                            textAlign: "center",
                            backgroundColor: "#F9FAFB",
                            cursor: "pointer",
                            position: "relative",
                            width: "100%",
                            height: "250px",
                            overflow: "hidden",
                        }}
                    >
                        {backgroundImageSrc ? (
                            <div
                                style={{
                                    position: "relative",
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <img
                                    src={backgroundImageSrc}
                                    alt="Uploaded Background"
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                                <button
                                    onClick={() => handleImageRemove(true)}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            !backgroundImageSrc && (
                                <label
                                    htmlFor="background-upload"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "16px",
                                        color: "#6B7280",
                                    }}
                                >
                                    Upload background
                                </label>
                            )
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleImageChange(event, true)}
                            id="background-upload"
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: "#6B7280",
                            color: "#fff",
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor: "pointer",
                            opacity: formData.name && formData.headImage && formData.backgroundImage ? 1 : 0.5,
                        }}
                    >
                      Creaye Your Drop
                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div style={{ maxWidth: "600px", flex: 1 }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
                    NFT Drop Preview
                </h2>
                <p style={{ fontSize: "16px", color: "#4B5563" }}>
                    Here’s how your NFT drop will appear once created. You can customize it further to fit your collection.
                </p>

                {/* Conditionally render the NFT preview if both imageSrc and name are provided */}
                {(imageSrc && formData.name) && (
                    <div style={{ border: "1px solid #D1D5DB", borderRadius: "8px", marginTop: "32px" }}>
                        <img
                            src={imageSrc}
                            alt="NFT Logo Preview"
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "300px",
                                borderRadius: "8px",
                            }}
                        />
                        <div style={{ padding: "16px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                                {formData.name}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#6B7280" }}>
                                NFT Drop
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
