"use client";
import Link from "next/link"
import { ArrowLeft, Grid, ImageIcon } from "lucide-react"
import ImageCarousel from './pixelImage/ImageCarousel';
import axios from "axios"; // Import axios
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
export default function CreatePage() {
  const [sellerData, setSellerData] = useState([]);

  const { address: connectedAddress } = useAccount();  // Get connected Ethereum address
  const fetchNftData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/nftUser/sellerTotal"); // Send GET request to the backend
      if (response.data) {
        setSellerData(response.data); // Update state with the fetched data
        // console.log(response.data)
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      // Optionally handle the error (e.g., show an error message to the user)
    }
  };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchNftData();
  }, []);

  // const isSeller = sellerData.some(item => item.address.toLowerCase() === connectedAddress!.toLowerCase());

  return (
    <div className="flex h-90">
      {/* Left Section */}
      <div className="flex-1 p-6 md:p-10">
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </nav>

        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <h1 className="text-3xl font-bold">Create</h1>
          </div>

          <div className="space-y-4">
            {/* Drop Option */}
            <Link
              href={sellerData.some(item => item.address === connectedAddress) ? '/myNFTs' : '/drop'}
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"

            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Grid className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Drop</h2>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
              <p className="mt-2 text-gray-600">
                A drop is the release of a new project. This usually happens on a specified date and time. Items will be revealed after they have been purchased.
              </p>
            </Link>

            {/* Collection Option */}
            <Link
              href="/myCreateCollection"
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Collection or item</h2>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
              <p className="mt-2 text-gray-600">
                Create a new NFT collection or add an NFT to an existing one. Your items will display immediately. List for sale when you&apos;re ready.
              </p>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="#" className="text-blue-600 hover:underline">
              Learn more
            </Link>
            <span className="text-gray-600"> about each option.</span>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden lg:block flex-1 ">
        <ImageCarousel />
      </div>
    </div>
  )
}

