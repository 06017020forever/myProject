"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";

interface Transaction {
    seller: string;
    buyer: string;
    price: bigint;
    timestamp: bigint;
    royalty: bigint;
}

interface TransactionTabsProps {
    transactions: Transaction[];
    tokenId: string;
}

export const TransactionTabs = ({ transactions, tokenId }: TransactionTabsProps) => {
    const [activeTab, setActiveTab] = useState("offers");

    return (
        <div className="mt-8">
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        className={`pb-4 px-1 ${activeTab === "price-history"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("price-history")}
                    >
                        Price History
                    </button>
                    <button
                        className={`pb-4 px-1 ${activeTab === "listings"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("listings")}
                    >
                        Listings
                    </button>
                    <button
                        className={`pb-4 px-1 ${activeTab === "offers"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        onClick={() => setActiveTab("offers")}
                    >
                        Offers
                    </button>
                </nav>
            </div>

            <div className="mt-4">
                {activeTab === "offers" && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">From</th>
                                    <th className="py-3 px-4">To</th>
                                    <th className="py-3 px-4">Timestamp</th>
                                    <th className="py-3 px-4">Royalty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={index} className="border-t border-gray-100">
                                        <td className="py-3 px-4">{formatEther(tx.price)} ETH</td>
                                        <td className="py-3 px-4"><Address address={tx.seller as `0x${string}`} /></td>
                                        <td className="py-3 px-4"><Address address={tx.buyer as `0x${string}`} /></td>
                                        <td className="py-3 px-4">{new Date(Number(tx.timestamp) * 1000).toLocaleString()}</td>
                                        <td className="py-3 px-4">{formatEther(tx.royalty)} ETH</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === "price-history" && (
                    <div className="p-4 text-center text-gray-500">
                        Price history chart will be displayed here
                    </div>
                )}
                {activeTab === "listings" && (
                    <div className="p-4 text-center text-gray-500">
                        Active listings will be displayed here
                    </div>
                )}
            </div>
        </div>
    );
};