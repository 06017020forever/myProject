"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import axios from "axios"; // Import axios
import {AuthModal} from "../components/AuthModal";
const trendingCollections = [
  {
    address:"0x22",
    name: "Zeeverse: Items",
    image: "/people3.jpg",
    floorPrice: "< 0.01 ETH",
    volume: "0.26 ETH",
    verified: true
  },
  {
    address:"0dasa",
    name: "MapleStory Universe",
    image: "/animal5.jpg",
    floorPrice: "0.08 AVAX",
    volume: "743 AVAX",
    verified: true
  },
  // Add more collections as needed
];



export default function Home() {
  const [sellerData, setSellerData] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");

  const fetchNftData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/nftUser/sellerTotal"); // Send GET request to the backend
      if (response.data) {
        setSellerData(response.data); // Update state with the fetched data
        console.log(response.data);
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



  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}

      {/* <nav className="flex items-center gap-8 p-4 border-b">
        <div className="flex gap-4">
          <button className="px-4 py-2 hover:bg-secondary rounded-lg">All</button>
          <button className="px-4 py-2 hover:bg-secondary rounded-lg">Art</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Gaming</button>
          <button className="px-4 py-2 hover:bg-secondary rounded-lg">Memberships</button>
          <button className="px-4 py-2 hover:bg-secondary rounded-lg">Photography</button>
          <button className="px-4 py-2 hover:bg-secondary rounded-lg">Music</button>
        </div>
      </nav> */}
      {/* Hero Section */}
      <div className="relative h-[600px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/OIP2.svg"
            alt="Hero"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          {/* <h1 className="text-5xl font-bold mb-2">Gaming NFTs</h1> */}
          <p className="text-lg opacity-80">Discover, collect, and trade gaming NFTs</p>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
          <button className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "trending" ? "bg-secondary" : ""
                }`}
              onClick={() => setActiveTab("trending")}
            >
              Trending
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "top" ? "bg-secondary" : ""
                }`}
              onClick={() => setActiveTab("top")}
            >
              Top
            </button>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2">24h</button>
            <button className="px-4 py-2">7d</button>
            <button className="px-4 py-2 flex items-center gap-2">
              All chains <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-4">
          {trendingCollections.map((collection) => (
            <Link
              href={`/collection/${collection.address}`}
              key={collection.address}
              className="flex items-center justify-between p-4 hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {collection.name}
                    {collection.verified && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </h3>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-muted-foreground">Floor Price</p>
                  <p className="font-semibold">{collection.floorPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="font-semibold">{collection.volume}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gaming Spotlight */}
        <h2 className="text-2xl font-bold mt-16 mb-8">Gaming spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellerData.map((item) => (
            <Link
              href={`/collection/${item.address}`}
              key={item.address}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <Image
                src={item.headImage}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold ">{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>

     
       

      </div>
    </main>
  );
}