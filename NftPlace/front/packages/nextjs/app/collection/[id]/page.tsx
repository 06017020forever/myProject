// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { ChevronDown, Share2, Grid, ListFilter, Twitter, MoreHorizontal } from "lucide-react"

// export default function CollectionPage() {
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

//   const collectionData = {
//     name: "MapleStory Universe - Make Special Name",
//     verified: true,
//     items: "39",
//     totalVolume: "6,183 AVAX",
//     floorPrice: "0.055 AVAX",
//     bestOffer: "0.045 WAVAX",
//     listed: "100%",
//     owners: "5,994 (34%)",
//     createdDate: "Created Nov 2024",
//     chain: "Chain: Avalanche",
//     earnings: "Creator earnings: 0%"
//   }

//   const nfts = [
//     { id: "Q", price: "0.055 AVAX", lastSale: "0.08 AVAX" },
//     { id: "Z", price: "0.08 AVAX", lastSale: "0.08 AVAX" },
//     { id: "V", price: "0.08 AVAX", lastSale: "0.08 AVAX" },
//     { id: "X", price: "0.08 AVAX", lastSale: "0.07 AVAX" },
//     { id: "U", price: "0.08 AVAX", lastSale: "0.06 AVAX" },
//     { id: "F", price: "0.08 AVAX", lastSale: "0.07 AVAX" },
//     { id: "7", price: "0.08 AVAX", lastSale: "0.07 AVAX" }
//   ]

//   return (
//     <div className="min-h-screen bg-[#0F1318]">
//       {/* Banner */}
//       <div className="relative h-[520px] w-full">
//         <Image
//           src="/people.jpg"
//           alt="Collection banner"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Collection Info */}
//       <div className="max-w-[1800px] mx-auto px-6 -mt-20 relative">
//         <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#0F1318] bg-[#0F1318]">
//           <Image
//             src="/placeholder.svg?height=128&width=128"
//             alt="Collection avatar"
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="mt-6 flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-4">
//               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//                 {collectionData.name}
//                 <span className="text-blue-500 text-xl">✓</span>
//               </h1>
//               <div className="flex gap-2">
//                 <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//                   <Twitter className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//                   <MoreHorizontal className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-2 text-sm text-gray-500 flex gap-4">
//               <span>{collectionData.createdDate}</span>
//               <span>{collectionData.chain}</span>
//               <span>{collectionData.earnings}</span>
//             </div>

//             <div className="mt-6 flex gap-8 text-sm">
//               <div>
//                 <p className="text-gray-400">Items</p>
//                 <p className="font-medium text-white">{collectionData.items}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Total Volume</p>
//                 <p className="font-medium text-white">{collectionData.totalVolume}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Floor Price</p>
//                 <p className="font-medium text-white">{collectionData.floorPrice}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Best Offer</p>
//                 <p className="font-medium text-white">{collectionData.bestOffer}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Listed</p>
//                 <p className="font-medium text-white">{collectionData.listed}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400">Owners</p>
//                 <p className="font-medium text-white">{collectionData.owners}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="mt-8 flex items-center justify-between border-b border-gray-800 pb-4">
//           <div className="flex items-center gap-4">
//             <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//               <ListFilter className="w-5 h-5" />
//             </button>
//             <input
//               type="text"
//               placeholder="Search by name or trait"
//               className="px-4 py-2 rounded-lg bg-[#1F2937] text-white border-none outline-none w-[280px]"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <select className="bg-[#1F2937] text-white px-4 py-2 rounded-lg border-none outline-none">
//               <option>Price low to high</option>
//               <option>Price high to low</option>
//             </select>
//             <button
//               className={`p-2 rounded-lg ${
//                 viewMode === "grid" ? "bg-[#1F2937]" : "hover:bg-[#1F2937]"
//               } text-gray-400`}
//               onClick={() => setViewMode("grid")}
//             >
//               <Grid className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* NFT Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 py-8">
//           {nfts.map((nft) => (
//             <div
//               key={nft.id}
//               className="rounded-xl overflow-hidden border border-gray-800 bg-[#1F2937] hover:shadow-lg transition-shadow"
//             >
//               <div className="relative aspect-square">
//                 <Image
//                   src="/placeholder.svg?height=300&width=300"
//                   alt={`NFT ${nft.id}`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="font-semibold text-white">Letter {nft.id}</h3>
//                 <div className="flex justify-between items-center mt-2">
//                   <div>
//                     <p className="text-xs text-gray-400">Price</p>
//                     <p className="text-sm text-white font-medium">{nft.price}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs text-gray-400">Last Sale</p>
//                     <p className="text-sm text-white font-medium">{nft.lastSale}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"
// import AirdropSchedule from '../_components/airdrop-schedule'
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { ChevronDown, Share2, Grid, ListFilter, Twitter, MoreHorizontal } from "lucide-react"
// import { Market } from "~~/app/marketPlace/page"; // Assuming you already have a Market component like in your second code
// import CaseSelectionPage from '~~/app/blindMarket/page';
// import { BidMark } from '~~/app/bid/page';
// import { RentalMark } from '~~/app/rental/_components/rentalMarket';
// import { FragmentMark } from "~~/app/FragmentationNft/page";
// type Status = "all" | "blind" | "bid" | "rental" | "fragment"
// import axios from "axios";

// type Tab = "overview" | "activity"


// export default function CollectionPage(props: { params: { id: string } }) {
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [activeStatus, setActiveStatus] = useState<Status>("all")
//   const [isStatusOpen, setIsStatusOpen] = useState<boolean>(true)  // State to toggle visibility of the status filter
//   const [sellerData, setSellerData] = useState([]);
//   const [activeTab, setActiveTab] = useState<Tab>("overview")
//   const { data: myTotalBalance } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "balanceOf",
//     args: [props.params.id as `0x${string}`],
//     watch: true,
//   });


//   const fetchNftData = async () => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8080/nftUser/sellerData",

//         { address: props.params.id }  // Send 
//       ); // Send GET request to the backend
//       if (response.data) {
//         setSellerData(response.data)

//       }
//     } catch (error) {
//       console.error("Error fetching NFT data:", error);
//       // Optionally handle the error (e.g., show an error message to the user)
//     }


//   };


//   useEffect(() => {
//     fetchNftData();
//   }, [props.params.id]);





//   const collectionData = {
//     name: sellerData[0]?.name || "Unnamed", // Use sellerData[0] properties
//     verified: true,
//     items: myTotalBalance ? myTotalBalance.toString() : "0",
//     totalVolume: "6,183 AVAX",
//     floorPrice: "0.055 AVAX",
//     bestOffer: "0.045 WAVAX",
//     listed: "100%",
//     owners: "5,994 (34%)",
//     createdDate: sellerData[0]?.timestamp,
//     chain: "Chain: Avalanche",
//     earnings: "Creator earnings: 0%"
//   }



//   const statusFilters: { label: string; value: Status }[] = [
//     { label: "All", value: "all" },
//     { label: "blind", value: "blind" },
//     { label: "bid", value: "bid" },
//     { label: "rental", value: "rental" },
//     { label: "fragment", value: "fragment" }
//   ]


//   const renderOverviewContent = () => (
//     <div className="max-w-[1280px] mx-auto mt-8" >
//       <div className="flex gap-8">

//         {/* <div className="w-1/2 space-y-6">

//             <div className="space-y-4"> */}

//         <div className="flex items-center gap-4">
//           <AirdropSchedule address={props.params.id} />
//         </div>
//         {/* </div>
//           </div> */}
//       </div>
//     </div>
//   )

//   return (
//     <div className="h-100% bg-white">
//       {/* Banner */}
//       <div className="relative h-[320px] w-full">
//         <Image
//           src={sellerData[0]?.backgroundImage}
//           alt="Collection banner"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Collection Info */}
//       <div className="max-w-[1800px] mx-auto px-6 -mt-20 relative">
//         {/* Collection Avatar and Info */}
//         <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4  bg-[#0F1318]">
//           <Image
//             src={sellerData[0]?.headImage}
//             alt="Collection avatar"
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="mt-6 flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-4">
//               <h1 className="text-2xl font-bold text-black flex items-center gap-2">
//                 {collectionData.name}
//                 <span className="text-blue-500 text-xl">✓</span>
//               </h1>
//               <div className="flex gap-2">
//                 <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//                   <Twitter className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//                   <Share2 className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
//                   <MoreHorizontal className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Collection Details */}
//             <div className="mt-2 text-sm text-gray-500 flex gap-4">
//               <span>items: {collectionData.items}</span>
//               <span>Created: {new Date(collectionData.createdDate).toLocaleDateString()}</span>
//               <span>{collectionData.chain}</span>
//               <span>{collectionData.earnings}</span>
//             </div>

//             <div className="mt-6 flex gap-8 text-sm">
//               <div className="mt-8 border-b border-gray-200">
//                 <div className="flex gap-8">
//                   <button
//                     onClick={() => setActiveTab("overview")}
//                     className={`pb-4 px-2 ${activeTab === "overview" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
//                   >
//                     Overview 概述
//                   </button>

//                   <button
//                     onClick={() => setActiveTab("activity")}
//                     className={`pb-4 px-2 ${activeTab === "activity" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
//                   >
//                     Activity 活动
//                   </button>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="mt-8 flex gap-8">
//           {activeTab === "overview" && renderOverviewContent()}

//           {isStatusOpen && activeTab === "activity" && (
//             <div className="w-64 flex-shrink-0">
//               <div className="bg-[#1F2937] rounded-xl p-4">
//                 <h3 className="text-white font-semibold mb-4">Status</h3>
//                 <div className="space-y-2">
//                   {statusFilters.map((filter) => (
//                     <button
//                       key={filter.value}
//                       onClick={() => setActiveStatus(filter.value)}
//                       className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeStatus === filter.value
//                         ? "bg-[#374151] text-white"
//                         : "text-gray-400 hover:bg-[#374151]"
//                         }`}
//                     >
//                       {filter.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//           {activeTab === "activity" && (

//             <div className="flex-1 min-h-[800px]">
//               {/* Filter Bar */}
//               <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
//                 <div className="flex items-center gap-4">
//                   <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400"
//                     onClick={() => setIsStatusOpen(!isStatusOpen)}  // Toggle status visibility
//                   >
//                     <ListFilter className="w-5 h-5" />
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Search by name or trait"
//                     className="px-4 py-2 rounded-lg bg-[#1F2937] text-white border-none outline-none w-[280px]"
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <select className="bg-[#1F2937] text-white px-4 py-2 rounded-lg border-none outline-none">
//                     <option>Price low to high</option>
//                     <option>Price high to low</option>
//                   </select>
//                   <button
//                     className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400"
//                     onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
//                   >
//                     {viewMode === "grid" ? <Grid className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>


//               {activeStatus === "all" && <Market address={props.params.id} />}
//               {activeStatus === "blind" && <CaseSelectionPage />}
//               {activeStatus === "bid" && <BidMark address={props.params.id} />}
//               {activeStatus === "rental" && <RentalMark address={props.params.id as `0x${string}`} />}
//               {activeStatus === "fragment" && <FragmentMark address={props.params.id as `0x${string}` } />}
//             </div>

//           )}


//         </div>
//       </div>
//     </div>
//   )
// }


"use client"
import AirdropSchedule from '../_components/airdrop-schedule'
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown, Share2, Grid, ListFilter, Twitter, MoreHorizontal } from 'lucide-react'
import { Market } from "~~/app/marketPlace/page";
// import CaseSelectionPage from '~~/app/blindMarket/page';
import Box3D from '~~/app/blindMarket/_components/Box3D';
import { BidMark } from '~~/app/bid/page';
import { RentalMark } from '~~/app/rental/_components/rentalMarket';
import { FragmentMark } from "~~/app/FragmentationNft/page";
type Status = "all" | "blind" | "bid" | "rental" | "fragment"
import axios from "axios";

type Tab = "overview" | "activity"

export default function CollectionPage(props: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeStatus, setActiveStatus] = useState<Status>("all")
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(true)
  const [sellerData, setSellerData] = useState([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { data: myTotalBalance } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "balanceOf",
    args: [props.params.id as `0x${string}`],
    watch: true,
  });



  const fetchNftData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/nftUser/sellerData",
        { address: props.params.id }
      );
      if (response.data) {
        setSellerData(response.data)
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
    }
  };

  useEffect(() => {
    fetchNftData();
  }, [props.params.id]);

  const collectionData = {
    name: sellerData[0]?.name || "Unnamed",
    verified: true,
    items: myTotalBalance ? myTotalBalance.toString() : "0",
    totalVolume: "6,183 AVAX",
    floorPrice: "0.055 AVAX",
    bestOffer: "0.045 WAVAX",
    listed: "100%",
    owners: "5,994 (34%)",
    createdDate: sellerData[0]?.timestamp,
    chain: "Chain: Avalanche",
    earnings: "Creator earnings: 0%"
  }

  const statusFilters: { label: string; value: Status }[] = [
    { label: "All", value: "all" },
    { label: "blind", value: "blind" },
    { label: "bid", value: "bid" },
    { label: "rental", value: "rental" },
    { label: "fragment", value: "fragment" }
  ]

  const renderOverviewContent = () => (
    <div className="max-w-[1280px] mx-auto mt-8" >
      <div className="flex gap-8">
        <div className="flex items-center gap-4">
          <AirdropSchedule address={props.params.id} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-100% bg-white">
      {/* Banner */}
      <div className="relative h-[320px] w-full">
        <Image
          src={sellerData[0]?.backgroundImage}
          alt="Collection banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Collection Info */}
      <div className="max-w-[1800px] mx-auto px-6 -mt-20 relative">
        {/* Collection Avatar and Info */}
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4  bg-[#0F1318]">
          <Image
            src={sellerData[0]?.headImage}
            alt="Collection avatar"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                {collectionData.name}
                <span className="text-blue-500 text-xl">✓</span>
              </h1>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Collection Details */}
            <div className="mt-2 text-sm text-gray-500 flex gap-4">
              <span>items: {collectionData.items}</span>
              <span>Created: {new Date(collectionData.createdDate).toLocaleDateString()}</span>
              <span>{collectionData.chain}</span>
              <span>{collectionData.earnings}</span>
            </div>

            <div className="mt-6 flex gap-8 text-sm">
              <div className="mt-8 border-b border-gray-200">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-4 px-2 ${activeTab === "overview" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    Overview 概述
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`pb-4 px-2 ${activeTab === "activity" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
                  >
                    Activity 活动
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 flex gap-8">
          {activeTab === "overview" && renderOverviewContent()}

          {isStatusOpen && activeTab === "activity" && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-[#1F2937] rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Status</h3>
                <div className="space-y-2">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveStatus(filter.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeStatus === filter.value
                        ? "bg-[#374151] text-white"
                        : "text-gray-400 hover:bg-[#374151]"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "activity" && (
            <div className="flex-1 min-h-[800px]">
              {/* Filter Bar */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400"
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                  >
                    <ListFilter className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search by name or description"
                    className="px-4 py-2 rounded-lg bg-[#1F2937] text-white border-none outline-none w-[280px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="px-4 py-2 rounded-lg bg-[#1F2937] text-white border-none outline-none w-[100px]"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="px-4 py-2 rounded-lg bg-[#1F2937] text-white border-none outline-none w-[100px]"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <select
                    className="bg-[#1F2937] text-white px-4 py-2 rounded-lg border-none outline-none"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                  >
                    <option value="asc">Price low to high</option>
                    <option value="desc">Price high to low</option>
                  </select>
                  <button
                    className="p-2 rounded-lg hover:bg-[#1F2937] text-gray-400"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <Grid className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {activeStatus === "all" && (
                <Market
                  address={props.params.id}
                  searchTerm={searchTerm}
                  sortOrder={sortOrder}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              )}
              {activeStatus === "blind" && <Box3D address={props.params.id} />}
              {/* {activeStatus === "blind" && <CaseSelectionPage address={props.params.id} />} */}
              {activeStatus === "bid" && <BidMark address={props.params.id} />}
              {activeStatus === "rental" && <RentalMark address={props.params.id as `0x${string}`} />}
              {activeStatus === "fragment" && <FragmentMark address={props.params.id as `0x${string}`} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

