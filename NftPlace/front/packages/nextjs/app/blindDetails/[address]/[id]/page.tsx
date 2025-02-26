"use client"

// import { useState, useRef, useCallback, useEffect } from "react"
// import { CaseState, WeaponSkin } from "../../ipfsDownload/types/case"

// const SPINNER_DURATION = 5500
// const ITEM_WIDTH = 250
// const ITEM_GAP = 24
// const TOTAL_ITEMS = 60
// const VISIBLE_ITEMS = 5

// export default function CaseOpeningPage({ params }: { params: { id: string } }) {
//   const [state, setState] = useState<CaseState>({
//     isSpinning: false,
//     selectedItem: null,
//     items: []
//   })
//   const [autoSpin, setAutoSpin] = useState(false)

//   const spinnerRef = useRef<HTMLDivElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)

//   const generateItems = useCallback((): WeaponSkin[] => {
//     const possibleItems: WeaponSkin[] = [
//       {
//         id: "deagle-calligraffiti",
//         item: "Desert Eagle",
//         skin: "Calligraffiti",
//         statTrak: true,
//         imageUrl: "/skins/deagle-calligraffiti.png",
//         wear: "Field-Tested",
//         float: 0.2688,
//         price: 1.15,
//         rarity: "classified"
//       },
//       // Add more items...
//     ]

//     return Array.from({ length: TOTAL_ITEMS }, () => {
//       const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)]
//       return { ...randomItem, id: `${randomItem.id}-${Math.random()}` }
//     })
//   }, [])

//   const startSpin = useCallback(() => {
//     if (state.isSpinning) return

//     const items = generateItems()
//     const selectedIndex = Math.floor(Math.random() * (TOTAL_ITEMS - VISIBLE_ITEMS)) + Math.floor(VISIBLE_ITEMS / 2)
//     const selectedItem = items[selectedIndex]

//     setState(prev => ({ ...prev, items, isSpinning: true, selectedItem: null }))

//     if (spinnerRef.current) {
//       const targetTranslate = -(ITEM_WIDTH + ITEM_GAP) * (selectedIndex - Math.floor(VISIBLE_ITEMS / 2))

//       spinnerRef.current.style.transition = "none"
//       spinnerRef.current.style.transform = "translateX(0px)"

//       // Force reflow
//       spinnerRef.current.offsetHeight

//       spinnerRef.current.style.transition = `transform ${SPINNER_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
//       spinnerRef.current.style.transform = `translateX(${targetTranslate}px)`
//     }

//     setTimeout(() => {
//       setState(prev => ({ 
//         ...prev, 
//         isSpinning: false,
//         selectedItem
//       }))
//     }, SPINNER_DURATION)
//   }, [state.isSpinning, generateItems])

//   useEffect(() => {
//     const items = generateItems()
//     setState(prev => ({ ...prev, items }))

//     if (containerRef.current) {
//       const blurOverlay = document.createElement('div')
//       blurOverlay.style.cssText = `
//         position: absolute;
//         inset: 0;
//         background: radial-gradient(
//           circle at center,
//           transparent 20%,
//           rgba(0, 0, 0, 0.8) 70%
//         );
//         pointer-events: none;
//         z-index: 10;
//       `
//       containerRef.current.appendChild(blurOverlay)

//       return () => blurOverlay.remove()
//     }
//   }, [generateItems])

//   if (state.selectedItem) {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(180deg, #1B2838 0%, #0A1017 100%)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '32px',
//         color: '#fff',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//       }}>
//         <div style={{
//           fontSize: '24px',
//           fontWeight: 'bold',
//           marginBottom: '8px',
//           color: '#FFD700'
//         }}>
//           StatTrak™ {state.selectedItem.item} | {state.selectedItem.skin}
//         </div>
//         <div style={{
//           fontSize: '18px',
//           color: 'rgba(255, 255, 255, 0.8)',
//           marginBottom: '32px'
//         }}>
//           {state.selectedItem.wear}
//         </div>

//         <div style={{
//           width: '600px',
//           height: '400px',
//           marginBottom: '32px',
//           position: 'relative'
//         }}>
//           <img
//             src={state.selectedItem.imageUrl}
//             alt={state.selectedItem.item}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'contain'
//             }}
//           />
//         </div>

//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '16px',
//           marginBottom: '32px'
//         }}>
//           <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
//             MIN: 0.00
//           </div>
//           <div style={{
//             width: '400px',
//             height: '8px',
//             background: 'linear-gradient(to right, #4B69FF, #FFD700, #EB4B4B)',
//             borderRadius: '4px',
//             position: 'relative'
//           }}>
//             <div style={{
//               width: '2px',
//               height: '100%',
//               background: '#fff',
//               position: 'absolute',
//               left: `${state.selectedItem.float * 100}%`,
//               transform: 'translateX(-50%)'
//             }} />
//           </div>
//           <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
//             MAX: 1.00
//           </div>
//         </div>

//         <div style={{
//           fontSize: '18px',
//           marginBottom: '32px'
//         }}>
//           Price: ${state.selectedItem.price.toFixed(2)} | Float: {state.selectedItem.float.toFixed(4)}
//         </div>

//         <div style={{
//           display: 'flex',
//           gap: '16px'
//         }}>
//           <button
//             onClick={() => setState(prev => ({ ...prev, selectedItem: null }))}
//             style={{
//               padding: '12px 32px',
//               background: '#4B69FF',
//               border: 'none',
//               borderRadius: '4px',
//               color: '#fff',
//               fontSize: '16px',
//               cursor: 'pointer',
//               transition: 'background 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = '#3D56CC'
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = '#4B69FF'
//             }}
//           >
//             Try again
//           </button>
//           <button
//             onClick={() => window.location.href = '/'}
//             style={{
//               padding: '12px 32px',
//               background: 'transparent',
//               border: '1px solid rgba(255, 255, 255, 0.2)',
//               borderRadius: '4px',
//               color: '#fff',
//               fontSize: '16px',
//               cursor: 'pointer',
//               transition: 'all 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
//             }}
//           >
//             Back to Cases
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(180deg, #1B2838 0%, #0A1017 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '32px'
//     }}>
//       <div
//         ref={containerRef}
//         style={{
//           width: `${ITEM_WIDTH * VISIBLE_ITEMS + ITEM_GAP * (VISIBLE_ITEMS - 1)}px`,
//           height: '400px',
//           position: 'relative',
//           overflow: 'hidden',
//           background: 'rgba(0, 0, 0, 0.2)',
//           borderRadius: '8px',
//           marginBottom: '32px'
//         }}
//       >
//         <div style={{
//           position: 'absolute',
//           left: '50%',
//           top: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '2px',
//           height: '250px',
//           background: 'rgba(255, 255, 255, 0.5)',
//           zIndex: 20
//         }} />
//         <div 
//           ref={spinnerRef}
//           style={{
//             display: 'flex',
//             gap: `${ITEM_GAP}px`,
//             position: 'absolute',
//             left: 0,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             transition: 'transform 0.5s ease-in-out'
//           }}
//         >
//           {state.items.map((item, index) => (
//             <div
//               key={item.id}
//               style={{
//                 width: `${ITEM_WIDTH}px`,
//                 height: '250px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 position: 'relative',
//                 background: 'linear-gradient(180deg, #F8F8F8 0%, #C7C7C7 100%)',
//                 borderRadius: '2px'
//               }}
//             >
//               <img 
//                 src={item.imageUrl} 
//                 alt={`${item.item} | ${item.skin}`}
//                 style={{
//                   width: '80%',
//                   objectFit: 'contain',
//                   marginBottom: '71px'
//                 }}
//               />
//               <div style={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: '71px',
//                 background: getRarityGradient(item.rarity),
//                 borderRadius: '0 0 2px 2px'
//               }}>
//                 <div style={{
//                   padding: '16px',
//                   color: '#fff'
//                 }}>
//                   <div style={{
//                     fontSize: '14px',
//                     fontWeight: 500
//                   }}>
//                     {item.item}
//                   </div>
//                   <div style={{
//                     fontSize: '12px',
//                     color: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     {item.skin}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '16px'
//       }}>
//         <button
//           onClick={startSpin}
//           disabled={state.isSpinning}
//           style={{
//             padding: '16px 32px',
//             background: state.isSpinning ? '#2C3B4F' : '#4B69FF',
//             border: 'none',
//             borderRadius: '4px',
//             color: '#fff',
//             fontSize: '16px',
//             cursor: state.isSpinning ? 'not-allowed' : 'pointer',
//             transition: 'background 0.2s'
//           }}
//           onMouseEnter={(e) => {
//             if (!state.isSpinning) {
//               e.currentTarget.style.background = '#3D56CC'
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!state.isSpinning) {
//               e.currentTarget.style.background = '#4B69FF'
//             }
//           }}
//         >
//           {state.isSpinning ? "Opening..." : "Open Case"}
//         </button>
//         <label style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           color: '#fff',
//           fontSize: '14px',
//           cursor: 'pointer'
//         }}>
//           <input
//             type="checkbox"
//             checked={autoSpin}
//             onChange={(e) => setAutoSpin(e.target.checked)}
//             style={{
//               width: '16px',
//               height: '16px',
//               cursor: 'pointer'
//             }}
//           />
//           Auto-spinning mode
//         </label>
//       </div>
//     </div>
//   )
// }

// function getRarityGradient(rarity: WeaponSkin['rarity']): string {
//   const gradients = {
//     'consumer': 'linear-gradient(90deg, #B0C3D9 0%, #808B96 100%)',
//     'industrial': 'linear-gradient(90deg, #5E98D9 0%, #2B4B6B 100%)',
//     'mil-spec': 'linear-gradient(90deg, #4B69FF 0%, #1C32A4 100%)',
//     'restricted': 'linear-gradient(90deg, #8847FF 0%, #5721B0 100%)',
//     'classified': 'linear-gradient(90deg, #D32CE6 0%, #740C8B 100%)',
//     'covert': 'linear-gradient(90deg, #EB4B4B 0%, #822020 100%)',
//     'rare': 'linear-gradient(90deg, #FFD700 0%, #B66303 100%)'
//   }
//   return gradients[rarity]
// }



// "use client"
// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { useState, useRef, useCallback, useEffect } from "react"
// import { CaseState, WeaponSkin } from "../../blindMarket/types/case"
// import { useScaffoldReadContract,useScaffoldContract } from "~~/hooks/scaffold-eth";
// const SPINNER_DURATION = 5500
// const ITEM_WIDTH = 250
// const ITEM_GAP = 24
// const TOTAL_ITEMS = 60
// const VISIBLE_ITEMS = 5

// export default function CaseOpeningPage({ params }: { params: { id: string } }) {
//   const [state, setState] = useState<CaseState>({
//     isSpinning: false,
//     selectedItem: null,
//     items: []
//   })


//   const [autoSpin, setAutoSpin] = useState(false)

//   const spinnerRef = useRef<HTMLDivElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)

//   const { data: yourCollectibleContract } = useScaffoldContract({
//     contractName: "YourCollectible",
//   });



//   const { data: nftBlindData } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAvailableTokens",
//   });



//   const generateItems = useCallback((): WeaponSkin[] => {
//     const possibleItems: WeaponSkin[] = [
//       {
//         id: "",
//         item: "",
//         skin: "",
//         statTrak: true,
//         imageUrl: "",
//         wear: "",
//         // float: "",
//         // price:"" ,
//         rarity: "classified"
//       },

//     ]

//     return Array.from({ length: TOTAL_ITEMS }, () => {
//       const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)]
//       return { ...randomItem, id: `${randomItem.id}-${Math.random()}` }
//     })
//   }, [])

//   const startSpin = useCallback(() => {
//     if (state.isSpinning) return

//     const items = generateItems()
//     console.log(items)
//     const selectedIndex = Math.floor(Math.random() * (TOTAL_ITEMS - VISIBLE_ITEMS)) + Math.floor(VISIBLE_ITEMS / 2)
//     const selectedItem = items[selectedIndex]

//     setState(prev => ({ ...prev, items, isSpinning: true, selectedItem: null }))

//     if (spinnerRef.current) {
//       const targetTranslate = -(ITEM_WIDTH + ITEM_GAP) * (selectedIndex - Math.floor(VISIBLE_ITEMS / 2))

//       spinnerRef.current.style.transition = "none"
//       spinnerRef.current.style.transform = `translateY(-50%)` // Maintain vertical centering

//       // Force reflow
//       spinnerRef.current.offsetHeight

//       spinnerRef.current.style.transition = `transform ${SPINNER_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
//       spinnerRef.current.style.transform = `translateY(-50%) translateX(${targetTranslate}px)` // Apply horizontal scroll
//     }

//     setTimeout(() => {
//       setState(prev => ({ 
//         ...prev, 
//         isSpinning: false,
//         selectedItem
//       }))
//     }, SPINNER_DURATION)
//   }, [state.isSpinning, generateItems])

//   useEffect(() => {
//     const items = generateItems()
//     setState(prev => ({ ...prev, items }))

//     if (containerRef.current) {
//       const blurOverlay = document.createElement('div')
//       blurOverlay.style.cssText = `
//         position: absolute;
//         inset: 0;
//         background: radial-gradient(
//           circle at center,
//           transparent 20%,
//           rgba(0, 0, 0, 0.8) 70%
//         );
//         pointer-events: none;
//         z-index: 10;
//       `
//       containerRef.current.appendChild(blurOverlay)

//       return () => blurOverlay.remove()
//     }
//   }, [generateItems])

//   if (state.selectedItem) {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(180deg, #1B2838 0%, #0A1017 100%)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '32px',
//         color: '#fff',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//       }}>
//         <div style={{
//           fontSize: '24px',
//           fontWeight: 'bold',
//           marginBottom: '8px',
//           color: '#FFD700'
//         }}>
//           StatTrak™ {state.selectedItem.item} | {state.selectedItem.skin}
//         </div>
//         <div style={{
//           fontSize: '18px',
//           color: 'rgba(255, 255, 255, 0.8)',
//           marginBottom: '32px'
//         }}>
//           {state.selectedItem.wear}
//         </div>

//         <div style={{
//           width: '600px',
//           height: '400px',
//           marginBottom: '32px',
//           position: 'relative'
//         }}>
//           <img
//             src={state.selectedItem.imageUrl}
//             alt={state.selectedItem.item}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'contain'
//             }}
//           />
//         </div>

//         <div style={{
//           display: 'flex',
//           gap: '16px'
//         }}>
//           <button
//             onClick={() => setState(prev => ({ ...prev, selectedItem: null }))}
//             style={{
//               padding: '12px 32px',
//               background: '#4B69FF',
//               border: 'none',
//               borderRadius: '4px',
//               color: '#fff',
//               fontSize: '16px',
//               cursor: 'pointer',
//               transition: 'background 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = '#3D56CC'
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = '#4B69FF'
//             }}
//           >
//             Try again
//           </button>
//           <button
//             onClick={() => window.location.href = '/'}
//             style={{
//               padding: '12px 32px',
//               background: 'transparent',
//               border: '1px solid rgba(255, 255, 255, 0.2)',
//               borderRadius: '4px',
//               color: '#fff',
//               fontSize: '16px',
//               cursor: 'pointer',
//               transition: 'all 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
//             }}
//           >
//             Back to Cases
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(180deg, #1B2838 0%, #0A1017 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '32px'
//     }}>
//       <div
//         ref={containerRef}
//         style={{
//           width: `${ITEM_WIDTH * VISIBLE_ITEMS + ITEM_GAP * (VISIBLE_ITEMS - 1)}px`,
//           height: '400px',
//           position: 'relative',
//           overflow: 'hidden',
//           background: 'rgba(0, 0, 0, 0.2)',
//           borderRadius: '8px',
//           marginBottom: '32px'
//         }}
//       >
//         <div style={{
//           position: 'absolute',
//           left: '50%',
//           top: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: '2px',
//           height: '250px',
//           background: 'rgba(255, 255, 255, 0.5)',
//           zIndex: 20
//         }} />
//         <div 
//           ref={spinnerRef}
//           style={{
//             display: 'flex',
//             gap: `${ITEM_GAP}px`,
//             position: 'absolute',
//             left: 0,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             transition: 'transform 0.5s ease-in-out'
//           }}
//         >
//           {state.items.map((item, index) => (
//             <div
//               key={item.id}
//               style={{
//                 width: `${ITEM_WIDTH}px`,
//                 height: '250px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 position: 'relative',
//                 background: 'linear-gradient(180deg, #F8F8F8 0%, #C7C7C7 100%)',
//                 borderRadius: '2px'
//               }}
//             >
//               <img 
//                 src={item.imageUrl} 
//                 alt={`${item.item} | ${item.skin}`}
//                 style={{
//                   width: '80%',
//                   objectFit: 'contain',
//                   marginBottom: '71px'
//                 }}
//               />
//               <div style={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: '71px',
//                 background: getRarityGradient(item.rarity),
//                 borderRadius: '0 0 2px 2px'
//               }}>
//                 <div style={{
//                   padding: '16px',
//                   color: '#fff'
//                 }}>
//                   <div style={{
//                     fontSize: '14px',
//                     fontWeight: 500
//                   }}>
//                     {item.item}
//                   </div>
//                   <div style={{
//                     fontSize: '12px',
//                     color: 'rgba(255, 255, 255, 0.8)'
//                   }}>
//                     {item.skin}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '16px'
//       }}>
//         <button
//           onClick={startSpin}
//           disabled={state.isSpinning}
//           style={{
//             padding: '16px 32px',
//             background: state.isSpinning ? '#2C3B4F' : '#4B69FF',
//             border: 'none',
//             borderRadius: '4px',
//             color: '#fff',
//             fontSize: '16px',
//             cursor: state.isSpinning ? 'not-allowed' : 'pointer',
//             transition: 'background 0.2s'
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = '#3D56CC'
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = '#4B69FF'
//           }}
//         >
//           {state.isSpinning ? "Opening..." : "Open Case"}
//         </button>
//         <label style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           color: '#fff',
//           fontSize: '14px',
//           cursor: 'pointer'
//         }}>
//           <input
//             type="checkbox"
//             checked={autoSpin}
//             onChange={(e) => setAutoSpin(e.target.checked)}
//             style={{
//               width: '16px',
//               height: '16px',
//               cursor: 'pointer'
//             }}
//           />
//           Auto-spinning mode
//         </label>
//       </div>
//     </div>
//   )
// }

// function getRarityGradient(rarity: WeaponSkin['rarity']): string {
//   const gradients = {
//     'consumer': 'linear-gradient(90deg, #B0C3D9 0%, #808B96 100%)',
//     'industrial': 'linear-gradient(90deg, #5E98D9 0%, #2B4B6B 100%)',
//     'mil-spec': 'linear-gradient(90deg, #4B69FF 0%, #1C32A4 100%)',
//     'restricted': 'linear-gradient(90deg, #8847FF 0%, #5721B0 100%)',
//     'classified': 'linear-gradient(90deg, #D32CE6 0%, #740C8B 100%)',
//     'covert': 'linear-gradient(90deg, #EB4B4B 0%, #822020 100%)',
//     'rare': 'linear-gradient(90deg, #FFD700 0%, #B66303 100%)'
//   }
//   return gradients[rarity]
// }

"use client";
import Link from "next/link"
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { useState, useRef, useCallback, useEffect } from "react";
import { CaseState, WeaponSkin } from "../../../blindMarket/types/case";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import ModelViewer from "../_components/modelViewer";
import { ArrowLeft} from "lucide-react"
const SPINNER_DURATION = 5500;
const ITEM_WIDTH = 250;
const ITEM_GAP = 24;
const TOTAL_ITEMS = 60;
const VISIBLE_ITEMS = 5;

export default function CaseOpeningPage({ params }: { params: { id: string } }) {
  const [state, setState] = useState<CaseState>({
    isSpinning: false,
    selectedItem: null,
    items: [],
  });

  const [autoSpin, setAutoSpin] = useState(false);

  const spinnerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded


  const { data: nftBlindData } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "getAvailableTokens",
  });



  // 修改部分：动态生成的 NFT 数据
  const generateItems = useCallback(async (): Promise<WeaponSkin[]> => {
    const possibleItems: WeaponSkin[] = (nftBlindData || []).map((nft: any) => ({
      id: nft.tokenId || "", // NFT 的唯一标识符
      item: nft.name || "Unknown Item", // NFT 名称
      skin: nft.tokenUri || "Default Skin", // 自定义皮肤名
      statTrak: Math.random() < 0.5, // 随机决定是否是 StatTrak™
      imageUrl: nft.imageUrl || "", // NFT 的图片链接
      wear: nft.wear || "", // 默认状态
      rarity: nft.rarity || "classified", // 稀有度
    }));

    const itemsWithMetadata = await Promise.all(
      possibleItems.map(async (item) => {
        const metadata = await getMetadataFromIPFS(item.skin); // 假设 tokenId 是 tokenURI
        return { ...item, imageUrl: metadata.image || "", item: metadata.name, wear: metadata.external_url };
      })
    );

    // 如果 NFT 数据为空，返回一个默认的空数组
    if (itemsWithMetadata.length === 0) {
      return Array.from({ length: TOTAL_ITEMS }, () => ({
        id: `${Math.random()}`,
        item: "Placeholder",
        skin: "Default Skin",
        statTrak: false,
        imageUrl: "",
        wear: "Factory New",
        rarity: "consumer",
      }));
    }

    // 填充到 TOTAL_ITEMS 的数量
    return Array.from({ length: TOTAL_ITEMS }, () => {
      const randomItem = itemsWithMetadata[Math.floor(Math.random() * itemsWithMetadata.length)];
      return { ...randomItem, id: `${randomItem.id}-${Math.random()}` };
    });
  }, [nftBlindData]); // 将 nftBlindData 作为依赖



  const startSpin = useCallback(async () => {
    if (state.isSpinning) return;

    const items = await generateItems();

    const selectedIndex = Math.floor(Math.random() * (TOTAL_ITEMS - VISIBLE_ITEMS)) + Math.floor(VISIBLE_ITEMS / 2);
    const selectedItem = items[selectedIndex];

    setState((prev) => ({ ...prev, items, isSpinning: true, selectedItem: null }));

    if (spinnerRef.current) {
      const targetTranslate = -(ITEM_WIDTH + ITEM_GAP) * (selectedIndex - Math.floor(VISIBLE_ITEMS / 2));

      spinnerRef.current.style.transition = "none";
      spinnerRef.current.style.transform = `translateY(-50%)`; // Maintain vertical centering

      // Force reflow
      spinnerRef.current.offsetHeight;

      spinnerRef.current.style.transition = `transform ${SPINNER_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      spinnerRef.current.style.transform = `translateY(-50%) translateX(${targetTranslate}px)`; // Apply horizontal scroll
    }

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isSpinning: false,
        selectedItem,
      }));
    }, SPINNER_DURATION);
  }, [state.isSpinning, generateItems]);

//   <Link
//   href="/myCreateCollection"
//   className="flex block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
// >
//     <ArrowLeft className="w-4 h-4" />
//     </Link>

  useEffect(() => {
    const fetchItems = async () => {
      const items = await generateItems(); // 处理异步逻辑
      setState((prev) => ({ ...prev, items }));
      setIsDataLoaded(true); // Data is now loaded
    };

    fetchItems();

    if (containerRef.current) {
      const blurOverlay = document.createElement("div");
      blurOverlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at center,
          transparent 20%,
          rgba(0, 0, 0, 0.8) 70%
        );
        pointer-events: none;
        z-index: 10;
      `;
      containerRef.current.appendChild(blurOverlay);

      return () => blurOverlay.remove();
    }
  }, [generateItems]);

  if (state.selectedItem) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#fff",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >


        <div
          style={{
            width: "600px",
            height: "400px",
            marginBottom: "32px",
            position: "relative",
          }}
        >
          <img src={state.selectedItem?.imageUrl} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />

          {/* <ModelViewer glbUrl={state.selectedItem?.imageUrl || ""} /> */}
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          <button
            onClick={() => setState((prev) => ({ ...prev, selectedItem: null }))}
            style={{
              padding: "12px 32px",
              background: "#4B69FF",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3D56CC";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#4B69FF";
            }}
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "12px 32px",
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (


    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >

      <div
        ref={containerRef}
        style={{
          width: `${ITEM_WIDTH * VISIBLE_ITEMS + ITEM_GAP * (VISIBLE_ITEMS - 1)}px`,
          height: "400px",
          position: "relative",
          overflow: "hidden",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          marginBottom: "32px",
        }}
      >
      <div style={{ position: "relative", width: "500px", height: "500px" }}>
      {isDataLoaded && (
        <div
          style={{
            position: "absolute",
            left: "110%",
            top: "50%",
            transform: "translate(0%, -70%)",
            width: `${ITEM_WIDTH}px`,
            height: "250px",
            border: "2px solid rgb(155,154,51)",
            boxSizing: "border-box",
            zIndex: 20,
          }}
        />
      )}
      {/* Rest of your component code */}
    </div>
        <div
          ref={spinnerRef}
          style={{
            display: "flex",
            gap: `${ITEM_GAP}px`,
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {state.items.map((item, index) => (
            <div
              key={item.id}
              style={{
                width: `${ITEM_WIDTH}px`,
                height: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: "linear-gradient(180deg, #F8F8F8 0%, #C7C7C7 100%)",
                borderRadius: "2px",
              }}
            >

              <img
                src={item.imageUrl}
                alt={item.imageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "0px",
                  background: getRarityGradient(item.rarity),
                  borderRadius: "0 0 2px 2px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    color: "#fff",
                  }}
                >

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={startSpin}
          disabled={state.isSpinning}
          style={{
            padding: "16px 32px",
            background: state.isSpinning ? "#2C3B4F" : "#4B69FF",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "16px",
            cursor: state.isSpinning ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3D56CC";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4B69FF";
          }}
        >
          {state.isSpinning ? "Opening..." : "Open Case"}
        </button>

      </div>
    </div>

  );
}

function getRarityGradient(rarity: WeaponSkin["rarity"]): string {
  const gradients = {
    consumer: "linear-gradient(90deg, #B0C3D9 0%, #808B96 100%)",
    industrial: "linear-gradient(90deg, #5E98D9 0%, #2B4B6B 100%)",
    "mil-spec": "linear-gradient(90deg, #4B69FF 0%, #1C32A4 100%)",
    restricted: "linear-gradient(90deg, #8847FF 0%, #5721B0 100%)",
    classified: "linear-gradient(90deg, #D32CE6 0%, #740C8B 100%)",
    covert: "linear-gradient(90deg, #EB4B4B 0%, #822020 100%)",
    rare: "linear-gradient(90deg, #FFD700 0%, #B66303 100%)",
  };
  return gradients[rarity];
}



{/* <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={autoSpin}
            onChange={(e) => setAutoSpin(e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
          />
          Auto-spinning mode
        </label> */}





// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { useState, useRef, useCallback, useEffect } from "react";
// import { CaseState, WeaponSkin } from "../../../blindMarket/types/case";
// import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
// import { parseEther} from "viem";

// const SPINNER_DURATION = 5500;
// const ITEM_WIDTH = 250;
// const ITEM_GAP = 24;
// const TOTAL_ITEMS = 60;
// const VISIBLE_ITEMS = 5;




// export default function CaseOpeningPage({ params }: { params: { id: string } }) {
//   const [state, setState] = useState<CaseState>({
//     isSpinning: false,
//     selectedItem: null,
//     items: [],
//   });

 
//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const spinnerRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded
//   const [MTokenIds, setTokenIds] = useState<bigint | undefined>();

//   const { data: nftBlindData } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAvailableTokens",
//   });



//   // 修改部分：动态生成的 NFT 数据
//   const generateItems = useCallback(async (): Promise<WeaponSkin[]> => {
//     const possibleItems: WeaponSkin[] = (nftBlindData || []).map((nft: any) => ({
//       id: nft.tokenId || "", // NFT 的唯一标识符
//       item: nft.name || "Unknown Item", // NFT 名称
//       skin: nft.tokenUri || "Default Skin", // 自定义皮肤名
//       statTrak: Math.random() < 0.5, // 随机决定是否是 StatTrak™
//       imageUrl: nft.imageUrl || "", // NFT 的图片链接
//       wear: nft.wear || "", // 默认状态
//       rarity: nft.rarity || "classified", // 稀有度
//     }));

//     const itemsWithMetadata = await Promise.all(
//       possibleItems.map(async (item) => {
//         const metadata = await getMetadataFromIPFS(item.skin); // 假设 tokenId 是 tokenURI
//         return { ...item, imageUrl: metadata.image || "", item: metadata.name, wear: metadata.external_url };
//       })
//     );

//     // 如果 NFT 数据为空，返回一个默认的空数组
//     if (itemsWithMetadata.length === 0) {
//       return Array.from({ length: TOTAL_ITEMS }, () => ({
//         id: `${Math.random()}`,
//         item: "Placeholder",
//         skin: "Default Skin",
//         statTrak: false,
//         imageUrl: "",
//         wear: "Factory New",
//         rarity: "consumer",
//       }));
//     }

//     // 填充到 TOTAL_ITEMS 的数量
//     return Array.from({ length: TOTAL_ITEMS }, () => {
//       const randomItem = itemsWithMetadata[Math.floor(Math.random() * itemsWithMetadata.length)];
//       return { ...randomItem, id: `${randomItem.id}-${Math.random()}` };
//     });
//   }, [nftBlindData]); // 将 nftBlindData 作为依赖

//   const {
//     data: events,

//   } = useScaffoldEventHistory({
//     contractName: "YourCollectible", // The contract name
//     eventName: "MysteryBoxBought", // Event name emitted by the mintBatch function
//     fromBlock: 0n, // Starting block number to watch for events (adjust accordingly)
//     watch: true, // Set to true if you want to listen for real-time events
//     blockData: true,
//     transactionData: true,
//     receiptData: true,
//   });


//   useEffect(() => {
//     if (events) {
//       events.forEach(event => {
//         const MtokenId = event.args.tokenId;

//         setTokenIds(MtokenId);

//       });
//     }
//   }, [events]);

//   const startSpin = useCallback(async () => {
//     if (state.isSpinning) return;

//     try {
//       const rawAddress = params.address; // 去掉多余空格
//        await writeContractAsync({
//         functionName: "buyMysteryBox",
//         args: [rawAddress],
//         value: BigInt(parseEther("1")), 
//       });

//       if (!MTokenIds) {
//         throw new Error("Failed to get token ID from transaction");
//       }

//       // Generate items for animation
//       const items = await generateItems();

//       const selectedIndex = items.findIndex(item => item.id === MTokenIds.toString());
//       const selectedItem = items[selectedIndex];

//       setState(prev => ({ ...prev, items, isSpinning: true, selectedItem: null }));

//       if (spinnerRef.current) {
//         const targetTranslate = -(ITEM_WIDTH + ITEM_GAP) * (selectedIndex - Math.floor(VISIBLE_ITEMS / 2));

//         spinnerRef.current.style.transition = "none";
//         spinnerRef.current.style.transform = "translateY(-50%)";
//         spinnerRef.current.offsetHeight; // Force reflow

//         spinnerRef.current.style.transition = `transform ${SPINNER_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
//         spinnerRef.current.style.transform = `translateY(-50%) translateX(${targetTranslate}px)`;
//       }

//       setTimeout(() => {
//         setState(prev => ({
//           ...prev,
//           isSpinning: false,
//           selectedItem,
//         }));
//       }, SPINNER_DURATION);

//     } catch (error) {
//       console.error("Error during case opening:", error);
//       setState(prev => ({ ...prev, isSpinning: false }));
//       // Handle error appropriately (show error message to user)
//     }
//   }, [state.isSpinning, generateItems, writeContractAsync, MTokenIds]);


//   useEffect(() => {
//     const fetchItems = async () => {
//       const items = await generateItems(); // 处理异步逻辑
//       setState((prev) => ({ ...prev, items }));
//       setIsDataLoaded(true); // Data is now loaded
//     };

//     fetchItems();

//     if (containerRef.current) {
//       const blurOverlay = document.createElement("div");
//       blurOverlay.style.cssText = `
//         position: absolute;
//         inset: 0;
//         background: radial-gradient(
//           circle at center,
//           transparent 20%,
//           rgba(0, 0, 0, 0.8) 70%
//         );
//         pointer-events: none;
//         z-index: 10;
//       `;
//       containerRef.current.appendChild(blurOverlay);

//       return () => blurOverlay.remove();
//     }
//   }, [generateItems]);

//   if (state.selectedItem) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "32px",
//           color: "#fff",
//           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         }}
//       >


//         <div
//           style={{
//             width: "600px",
//             height: "400px",
//             marginBottom: "32px",
//             position: "relative",
//           }}
//         >
//           <img src={state.selectedItem?.imageUrl} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />


//         </div>

//         <div
//           style={{
//             display: "flex",
//             gap: "16px",
//           }}
//         >
//           <button
//             onClick={() => setState((prev) => ({ ...prev, selectedItem: null }))}
//             style={{
//               padding: "12px 32px",
//               background: "#4B69FF",
//               border: "none",
//               borderRadius: "4px",
//               color: "#fff",
//               fontSize: "16px",
//               cursor: "pointer",
//               transition: "background 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#3D56CC";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#4B69FF";
//             }}
//           >
//             Try again
//           </button>
//           <button
//             onClick={() => (window.location.href = "/")}
//             style={{
//               padding: "12px 32px",
//               background: "transparent",
//               border: "1px solid rgba(255, 255, 255, 0.2)",
//               borderRadius: "4px",
//               color: "#fff",
//               fontSize: "16px",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
//             }}
//           >
//             Back to Cases
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (


//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "32px",
//       }}
//     >

//       <div
//         ref={containerRef}
//         style={{
//           width: `${ITEM_WIDTH * VISIBLE_ITEMS + ITEM_GAP * (VISIBLE_ITEMS - 1)}px`,
//           height: "400px",
//           position: "relative",
//           overflow: "hidden",
//           background: "rgba(0, 0, 0, 0.2)",
//           borderRadius: "8px",
//           marginBottom: "32px",
//         }}
//       >
//         <div style={{ position: "relative", width: "500px", height: "500px" }}>
//           {isDataLoaded && (
//             <div
//               style={{
//                 position: "absolute",
//                 left: "110%",
//                 top: "50%",
//                 transform: "translate(0%, -70%)",
//                 width: `${ITEM_WIDTH}px`,
//                 height: "250px",
//                 border: "2px solid rgb(155,154,51)",
//                 boxSizing: "border-box",
//                 zIndex: 20,
//               }}
//             />
//           )}
//           {/* Rest of your component code */}
//         </div>
//         <div
//           ref={spinnerRef}
//           style={{
//             display: "flex",
//             gap: `${ITEM_GAP}px`,
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             transition: "transform 0.5s ease-in-out",
//           }}
//         >
//           {state.items.map((item, index) => (
//             <div
//               key={item.id}
//               style={{
//                 width: `${ITEM_WIDTH}px`,
//                 height: "250px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "relative",
//                 background: "linear-gradient(180deg, #F8F8F8 0%, #C7C7C7 100%)",
//                 borderRadius: "2px",
//               }}
//             >

//               <img
//                 src={item.imageUrl}
//                 alt={item.imageUrl}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'contain'
//                 }}
//               />

//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   height: "0px",
//                   background: getRarityGradient(item.rarity),
//                   borderRadius: "0 0 2px 2px",
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: "16px",
//                     color: "#fff",
//                   }}
//                 >

//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "16px",
//         }}
//       >
//         <button
//           onClick={startSpin}
//           disabled={state.isSpinning}
//           style={{
//             padding: "16px 32px",
//             background: state.isSpinning ? "#2C3B4F" : "#4B69FF",
//             border: "none",
//             borderRadius: "4px",
//             color: "#fff",
//             fontSize: "16px",
//             cursor: state.isSpinning ? "not-allowed" : "pointer",
//             transition: "background 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "#3D56CC";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "#4B69FF";
//           }}
//         >
//           {state.isSpinning ? "Opening..." : "Open Case"}
//         </button>

//       </div>
//     </div>

//   );
// }

// function getRarityGradient(rarity: WeaponSkin["rarity"]): string {
//   const gradients = {
//     consumer: "linear-gradient(90deg, #B0C3D9 0%, #808B96 100%)",
//     industrial: "linear-gradient(90deg, #5E98D9 0%, #2B4B6B 100%)",
//     "mil-spec": "linear-gradient(90deg, #4B69FF 0%, #1C32A4 100%)",
//     restricted: "linear-gradient(90deg, #8847FF 0%, #5721B0 100%)",
//     classified: "linear-gradient(90deg, #D32CE6 0%, #740C8B 100%)",
//     covert: "linear-gradient(90deg, #EB4B4B 0%, #822020 100%)",
//     rare: "linear-gradient(90deg, #FFD700 0%, #B66303 100%)",
//   };
//   return gradients[rarity];
// }



// import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
// import { useState, useRef, useCallback, useEffect } from "react";
// import { CaseState, WeaponSkin } from "../../../blindMarket/types/case";
// import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
// import { parseEther } from "viem";

// const SPINNER_DURATION = 5500;
// const ITEM_WIDTH = 250;
// const ITEM_GAP = 24;
// const TOTAL_ITEMS = 60;
// const VISIBLE_ITEMS = 5;

// export default function CaseOpeningPage({ params }: { params: { id: string } }) {
//   const [state, setState] = useState<CaseState>({
//     isSpinning: false,
//     selectedItem: null,
//     items: [],
//   });

//   const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");
//   const spinnerRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [MTokenIds, setTokenIds] = useState<bigint | undefined>();

//   const { data: nftBlindData } = useScaffoldReadContract({
//     contractName: "YourCollectible",
//     functionName: "getAvailableTokens",
//   });

//   const generateItems = useCallback(async (): Promise<WeaponSkin[]> => {
//     const possibleItems: WeaponSkin[] = (nftBlindData || []).map((nft: any) => ({
//       id: nft.tokenId || "",
//       item: nft.name || "Unknown Item",
//       skin: nft.tokenUri || "Default Skin",
//       statTrak: Math.random() < 0.5,
//       imageUrl: nft.imageUrl || "",
//       wear: nft.wear || "",
//       rarity: nft.rarity || "classified",
//     }));

//     const itemsWithMetadata = await Promise.all(
//       possibleItems.map(async (item) => {
//         const metadata = await getMetadataFromIPFS(item.skin);
//         return { ...item, imageUrl: metadata.image || "", item: metadata.name, wear: metadata.external_url };
//       })
//     );

//     if (itemsWithMetadata.length === 0) {
//       return Array.from({ length: TOTAL_ITEMS }, () => ({
//         id: `${Math.random()}`,
//         item: "Placeholder",
//         skin: "Default Skin",
//         statTrak: false,
//         imageUrl: "",
//         wear: "Factory New",
//         rarity: "consumer",
//       }));
//     }

//     return Array.from({ length: TOTAL_ITEMS }, () => {
//       const randomItem = itemsWithMetadata[Math.floor(Math.random() * itemsWithMetadata.length)];
//       return { ...randomItem, id: `${randomItem.id}-${Math.random()}` };
//     });
//   }, [nftBlindData]);

//   const {
//     data: events,
//   } = useScaffoldEventHistory({
//     contractName: "YourCollectible",
//     eventName: "MysteryBoxBought",
//     fromBlock: 0n,
//     watch: true,
//     blockData: true,
//     transactionData: true,
//     receiptData: true,
//   });

//   useEffect(() => {
//     if (events) {
//       events.forEach(event => {
//         const MtokenId = event.args.tokenId;
//         setTokenIds(MtokenId);
//       });
//     }
//   }, [events]);

//   const startSpin = useCallback(async () => {
//     if (state.isSpinning) return;

//     try {
//       const rawAddress = params.address;
//       await writeContractAsync({
//         functionName: "buyMysteryBox",
//         args: [rawAddress],
//         value: BigInt(parseEther("1")),
//       });

//       if (!MTokenIds) {
//         throw new Error("Failed to get token ID from transaction");
//       }

//       const items = await generateItems();

//       const selectedIndex = items.findIndex(item => item.id === MTokenIds.toString());
//       const selectedItem = items[selectedIndex];

//       setState(prev => ({ ...prev, items, isSpinning: true, selectedItem: null }));

//       if (spinnerRef.current) {
//         const targetTranslate = -(ITEM_WIDTH + ITEM_GAP) * (selectedIndex - Math.floor(VISIBLE_ITEMS / 2));

//         spinnerRef.current.style.transition = "none";
//         spinnerRef.current.style.transform = "translateX(0)";
//         spinnerRef.current.offsetHeight; // Force reflow

//         spinnerRef.current.style.transition = `transform ${SPINNER_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
//         spinnerRef.current.style.transform = `translateX(${targetTranslate}px)`;
//       }

//       setTimeout(() => {
//         setState(prev => ({
//           ...prev,
//           isSpinning: false,
//           selectedItem,
//         }));
//       }, SPINNER_DURATION);

//     } catch (error) {
//       console.error("Error during case opening:", error);
//       setState(prev => ({ ...prev, isSpinning: false }));
//     }
//   }, [state.isSpinning, generateItems, writeContractAsync, MTokenIds, params.address]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       const items = await generateItems();
//       setState((prev) => ({ ...prev, items }));
//       setIsDataLoaded(true);
//     };

//     fetchItems();

//     if (containerRef.current) {
//       const blurOverlay = document.createElement("div");
//       blurOverlay.style.cssText = `
//         position: absolute;
//         inset: 0;
//         background: radial-gradient(
//           circle at center,
//           transparent 20%,
//           rgba(0, 0, 0, 0.8) 70%
//         );
//         pointer-events: none;
//         z-index: 10;
//       `;
//       containerRef.current.appendChild(blurOverlay);

//       return () => blurOverlay.remove();
//     }
//   }, [generateItems]);

//   if (state.selectedItem) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "32px",
//           color: "#fff",
//           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         }}
//       >
//         <div
//           style={{
//             width: "600px",
//             height: "400px",
//             marginBottom: "32px",
//             position: "relative",
//           }}
//         >
//           <img src={state.selectedItem?.imageUrl} alt="NFT Image" className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             gap: "16px",
//           }}
//         >
//           <button
//             onClick={() => setState((prev) => ({ ...prev, selectedItem: null }))}
//             style={{
//               padding: "12px 32px",
//               background: "#4B69FF",
//               border: "none",
//               borderRadius: "4px",
//               color: "#fff",
//               fontSize: "16px",
//               cursor: "pointer",
//               transition: "background 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#3D56CC";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#4B69FF";
//             }}
//           >
//             Try again
//           </button>
//           <button
//             onClick={() => (window.location.href = "/")}
//             style={{
//               padding: "12px 32px",
//               background: "transparent",
//               border: "1px solid rgba(255, 255, 255, 0.2)",
//               borderRadius: "4px",
//               color: "#fff",
//               fontSize: "16px",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
//             }}
//           >
//             Back to Cases
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(180deg, #1B2838 0%, #0A1017 100%)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "32px",
//       }}
//     >
//       <div
//         ref={containerRef}
//         style={{
//           width: `${ITEM_WIDTH * VISIBLE_ITEMS + ITEM_GAP * (VISIBLE_ITEMS - 1)}px`,
//           height: "400px",
//           position: "relative",
//           overflow: "hidden",
//           background: "rgba(0, 0, 0, 0.2)",
//           borderRadius: "8px",
//           marginBottom: "32px",
//         }}
//       >
//         <div style={{ position: "relative", width: "500px", height: "500px" }}>
//           {isDataLoaded && (
//             <div
//               style={{
//                 position: "absolute",
//                 left: "50%",
//                 top: "50%",
//                 transform: "translate(-50%, -50%)",
//                 width: `${ITEM_WIDTH}px`,
//                 height: "250px",
//                 border: "2px solid rgb(155,154,51)",
//                 boxSizing: "border-box",
//                 zIndex: 20,
//               }}
//             />
//           )}
//         </div>
//         <div
//           ref={spinnerRef}
//           style={{
//             display: "flex",
//             gap: `${ITEM_GAP}px`,
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             transition: "transform 0.5s ease-in-out",
//           }}
//         >
//           {state.items.map((item, index) => (
//             <div
//               key={item.id}
//               style={{
//                 width: `${ITEM_WIDTH}px`,
//                 height: "250px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "relative",
//                 background: "linear-gradient(180deg, #F8F8F8 0%, #C7C7C7 100%)",
//                 borderRadius: "2px",
//               }}
//             >
//               <img
//                 src={item.imageUrl}
//                 alt={item.item}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'contain'
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   height: "0px",
//                   background: getRarityGradient(item.rarity),
//                   borderRadius: "0 0 2px 2px",
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: "16px",
//                     color: "#fff",
//                   }}
//                 >
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "16px",
//         }}
//       >
//         <button
//           onClick={startSpin}
//           disabled={state.isSpinning}
//           style={{
//             padding: "16px 32px",
//             background: state.isSpinning ? "#2C3B4F" : "#4B69FF",
//             border: "none",
//             borderRadius: "4px",
//             color: "#fff",
//             fontSize: "16px",
//             cursor: state.isSpinning ? "not-allowed" : "pointer",
//             transition: "background 0.2s",
//           }}
//           onMouseEnter={(e) => {
//             if (!state.isSpinning) {
//               e.currentTarget.style.background = "#3D56CC";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!state.isSpinning) {
//               e.currentTarget.style.background = "#4B69FF";
//             }
//           }}
//         >
//           {state.isSpinning ? "Opening..." : "Open Case"}
//         </button>
//       </div>
//     </div>
//   );
// }

// function getRarityGradient(rarity: WeaponSkin["rarity"]): string {
//   const gradients = {
//     consumer: "linear-gradient(90deg, #B0C3D9 0%, #808B96 100%)",
//     industrial: "linear-gradient(90deg, #5E98D9 0%, #2B4B6B 100%)",
//     "mil-spec": "linear-gradient(90deg, #4B69FF 0%, #1C32A4 100%)",
//     restricted: "linear-gradient(90deg, #8847FF 0%, #5721B0 100%)",
//     classified: "linear-gradient(90deg, #D32CE6 0%, #740C8B 100%)",
//     covert: "linear-gradient(90deg, #EB4B4B 0%, #822020 100%)",
//     rare: "linear-gradient(90deg, #FFD700 0%, #B66303 100%)",
//   };
//   return gradients[rarity] || gradients.consumer;
// }

