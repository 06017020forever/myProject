// 'use client'

// import { useEffect, useState } from 'react'

// interface AwardScrollerProps {
//   airList: { address: string; tokenId: string }[]
// }

// export const AwardScroller: React.FC<AwardScrollerProps> = ({ airList }) => {
//   const [isHovered, setIsHovered] = useState(false)

//   // 处理长地址，保留开头和结尾
//   const formatAddress = (address: string) => {
//     if (address.length > 12) {
//       return `${address.slice(0, 6)}...${address.slice(-4)}`
//     }
//     return address
//   }

//   // 合并并重复数据，确保无缝滚动
//   const repeatedItems = [...airList, ...airList].map(item => ({
//     address: formatAddress(item.address),
//     tokenId: item.tokenId
//   }))

//   return (
//     <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
//       <div className="relative h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden shadow-xl">
//         {/* 渐变遮罩 - 左侧 */}
//         <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-blue-600 to-transparent z-10" />

//         {/* 渐变遮罩 - 右侧 */}
//         <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-purple-600 to-transparent z-10" />

//         {/* 滚动内容容器 */}
//         <div 
//           className="absolute whitespace-nowrap animate-scroll"
//           style={{ 
//             animationPlayState: isHovered ? 'paused' : 'running',
//             animationDuration: '30s'
//           }}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {repeatedItems.map((item, index) => (
//             <span 
//               key={index} 
//               className="inline-flex items-center mx-6 text-white font-medium"
//             >
//               <span className="bg-white/10 rounded-full px-4 py-1 backdrop-blur-sm">
//                 {item.address}
//               </span>
//               <span className="ml-2 text-yellow-300 font-bold">
//                 #{item.tokenId}
//               </span>
//             </span>
//           ))}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes scroll {
//           0% {
//             transform: translateX(100%);
//           }
//           100% {
//             transform: translateX(-100%);
//           }
//         }
//         .animate-scroll {
//           animation: scroll linear infinite;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default AwardScroller

'use client'

import { useState } from 'react'

interface AwardScrollerProps {
  airList: { address: string; tokenId: string }[]
}

export const AwardScroller: React.FC<AwardScrollerProps> = ({ airList }) => {
  const [isHovered, setIsHovered] = useState(false)
  console.log(airList);
  // 处理长地址，保留开头和结尾
  const formatAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return address
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="relative h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden shadow-xl">
        {/* 渐变遮罩 - 左侧 */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-blue-600 to-transparent z-10" />

        {/* 渐变遮罩 - 右侧 */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-purple-600 to-transparent z-10" />

        {/* 滚动内容容器 */}
        <div
          className="absolute whitespace-nowrap animate-scroll"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
            animationDuration: '25s'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 原始数据 */}
          {airList.map((item, index) => (
            <span
              key={`original-${index}`}
              className="inline-flex items-center mx-6 text-white font-medium"
            >
              <span className="bg-white/10 rounded-full px-4 py-1 backdrop-blur-sm">
                {formatAddress(item.address)}
              </span>
              <span className="ml-2 text-yellow-300 font-bold">
                #{item.tokenId}
              </span>
            </span>
          ))}

          {/* 重复数据（为了视觉上的无缝衔接） */}
          {airList.map((item, index) => (
            <span
              key={`duplicate-${index}`}
              className="inline-flex items-center mx-6 text-white font-medium"
            >
              <span className="bg-white/10 rounded-full px-4 py-1 backdrop-blur-sm">
                {formatAddress(item.address)}
              </span>
              <span className="ml-2 text-yellow-300 font-bold">
                #{item.tokenId}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: inline-flex;
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  )
}

export default AwardScroller
