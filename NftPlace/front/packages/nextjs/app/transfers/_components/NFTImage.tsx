"use client";

import { useState } from "react";

interface NFTImageProps {
  image: string;
  name: string;
}

export const NFTImage = ({ image, name }: NFTImageProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-[100%] object-cover cursor-pointer"
          onClick={() => setModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50" onClick={() => setModalOpen(false)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};