// "use client";

// import React, { useCallback, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ArrowDownTrayIcon,
//   ArrowPathIcon,
//   ArrowUpTrayIcon,
//   Bars3Icon,
//   BugAntIcon,
//   PhotoIcon,
// } from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
// import { useOutsideClick } from "~~/hooks/scaffold-eth";

// type HeaderMenuLink = {
//   label: string;
//   href: string;
//   icon?: React.ReactNode;
// };

// export const menuLinks: HeaderMenuLink[] = [
//   {
//     label: "My NFTs",
//     href: "/myNFTs",
//     icon: <PhotoIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Transfers",
//     href: "/transfers",
//     icon: <ArrowPathIcon className="h-4 w-4" />,
//   },
//   {
//     label: "IPFS Upload",
//     href: "/ipfsUpload",
//     icon: <ArrowUpTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "IPFS Download",
//     href: "/ipfsDownload",
//     icon: <ArrowDownTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Debug Contracts",
//     href: "/debug",
//     icon: <BugAntIcon className="h-4 w-4" />,
//   },
// ];

// export const HeaderMenuLinks = () => {
//   const pathname = usePathname();

//   return (
//     <>
//       {menuLinks.map(({ label, href, icon }) => {
//         const isActive = pathname === href;
//         return (
//           <li key={href}>
//             <Link
//               href={href}
//               passHref
//               className={`${
//                 isActive ? "bg-secondary shadow-md" : ""
//               } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
//             >
//               {icon}
//               <span>{label}</span>
//             </Link>
//           </li>
//         );
//       })}
//     </>
//   );
// };

// /**
//  * Site header
//  */
// export const Header = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const burgerMenuRef = useRef<HTMLDivElement>(null);
//   useOutsideClick(
//     burgerMenuRef,
//     useCallback(() => setIsDrawerOpen(false), []),
//   );

//   return (
//     <div className="sticky xl:static top-0 navbar bg-primary min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
//       <div className="navbar-start w-auto xl:w-1/2">
//         <div className="xl:hidden dropdown" ref={burgerMenuRef}>
//           <label
//             tabIndex={0}
//             className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
//             onClick={() => {
//               setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
//             }}
//           >
//             <Bars3Icon className="h-1/2" />
//           </label>
//           {isDrawerOpen && (
//             <ul
//               tabIndex={0}
//               className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               onClick={() => {
//                 setIsDrawerOpen(false);
//               }}
//             >
//               <HeaderMenuLinks />
//             </ul>
//           )}
//         </div>
//         <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
//           <div className="flex relative w-10 h-10">
//             <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
//           </div>
//           <div className="flex flex-col">
//             <span className="font-bold leading-tight">SRE Challenges</span>
//             <span className="text-xs">#0: Simple NFT</span>
//           </div>
//         </Link>
//         <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
//           <HeaderMenuLinks />
//         </ul>
//       </div>
//       <div className="navbar-end flex-grow mr-4">
//         <RainbowKitCustomConnectButton />
//         <FaucetButton />
//       </div>
//     </div>
//   );
// };


// "use client";

// import React, { useCallback, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ArrowDownTrayIcon,
//   CreditCardIcon,
//   UserIcon,
//   ArrowPathIcon,
//   ArrowUpTrayIcon,
//   Bars3Icon,
//   BugAntIcon,
//   PhotoIcon,
//   ShoppingCartIcon,
// } from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
// import { useOutsideClick } from "~~/hooks/scaffold-eth";

// type HeaderMenuLink = {
//   label: string;
//   href: string;
//   icon?: React.ReactNode;
// };

// export const menuLinks: HeaderMenuLink[] = [
//   {
//     label: "",
//     href: "/CreateCollection",
//     icon: <UserIcon className="h-6 w-6 text-black-400" />,

//   },

//   {
//     label: "盲盒市场",
//     href: "/blindMarket",
//     // icon: <ArrowUpTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "碎片化市场",
//     href: "/FragmentationNft",
//     // icon: <ArrowDownTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "PeopleModel",
//     href: "/peopleModel",
//     // icon: <BugAntIcon className="h-4 w-4" />,
//   },
//   {
//     label: "空投",
//     href: "/airDrop",
//     // icon: <BugAntIcon className="h-4 w-4" />,
//   },
//   {
//     label: "NFT市场",
//     href: "/marketPlace",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Debug Contracts",
//     href: "/debug",
//     icon: <BugAntIcon className="h-4 w-4" />,
//   },
// ];

// export const HeaderMenuLinks = () => {
//   const pathname = usePathname();

//   return (
//     <>
//       {menuLinks.map(({ label, href, icon }) => {
//         const isActive = pathname === href;
//         return (
//           <li key={href}>
//             <Link
//               href={href}
//               passHref
//               className={`
//                 ${isActive ? "bg-[#ffffff] shadow-md" : "text-black"}
//                 hover:bg-[#ffffff] hover:shadow-md focus:!bg-[#ffffff] active:!text-neutral 
//                 py-2 px-3 text-sm sm:text-base md:text-lg lg:text-xl rounded-full gap-0.5 grid grid-flow-col 
//                 flex items-center justify-center`}
//             >
//               {icon}
//               <span>{label}</span>
//             </Link>
//           </li>
//         );
//       })}
//     </>
//   );
// };

// /**
//  * Site header
//  */
// export const Header = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const burgerMenuRef = useRef<HTMLDivElement>(null);
//   useOutsideClick(
//     burgerMenuRef,
//     useCallback(() => setIsDrawerOpen(false), []),
//   );

//   return (
//     <div className="sticky xl:static top-0 navbar bg-[#ffffff] min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
//       <div className="navbar-start w-auto xl:w-1/2">
//         <div className="xl:hidden dropdown" ref={burgerMenuRef}>
//           <label
//             tabIndex={0}
//             className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-white" : "hover:bg-white"}`}
//             onClick={() => {
//               setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
//             }}
//           >
//             <Bars3Icon className="h-1/2" />
//           </label>
//           {isDrawerOpen && (
//             <ul
//               tabIndex={0}
//               className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               onClick={() => {
//                 setIsDrawerOpen(false);
//               }}
//             >
//               <HeaderMenuLinks />
//             </ul>
//           )}
//         </div>
//         <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
//           <div className="flex relative w-[70px] h-[75px]">
//             <Image alt="SE2 logo" className="cursor-pointer" fill src="/file.png" />
//           </div>
//           {/* <div className="flex flex-col">
//             <span className="font-bold leading-tight">SRE Challenges</span>
//             <span className="text-xs">#0: Simple NFT</span>
//           </div> */}
//         </Link>
//         <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
//           <HeaderMenuLinks />
//         </ul>
//       </div>
//       <div className="navbar-end flex-grow mr-4">
//         <RainbowKitCustomConnectButton />
//         <FaucetButton />
//       </div>
//     </div>
//   );
// };



// "use client";

// import React, { useCallback, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ArrowDownTrayIcon,
//   CreditCardIcon,
//   UserIcon,
//   ArrowPathIcon,
//   ArrowUpTrayIcon,
//   Bars3Icon,
//   BugAntIcon,
//   PhotoIcon,
//   ShoppingCartIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
// import { useOutsideClick } from "~~/hooks/scaffold-eth";

// type HeaderMenuLink = {
//   label: string;
//   href: string;
//   icon?: React.ReactNode;
// };

// const menuLinks: HeaderMenuLink[] = [
//   {
//     label: "",
//     href: "/CreateCollection",
//     icon: <UserIcon className="h-6 w-6 text-black-400" />,
//   },
//   {
//     label: "盲盒市场",
//     href: "/blindMarket",
//   },
//   {
//     label: "碎片化市场",
//     href: "/FragmentationNft",
//   },
//   {
//     label: "PeopleModel",
//     href: "/peopleModel",
//   },
//   {
//     label: "空投",
//     href: "/airDrop",
//   },
//   {
//     label: "NFT市场",
//     href: "/marketPlace",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Debug Contracts",
//     href: "/debug",
//     icon: <BugAntIcon className="h-4 w-4" />,
//   },
// ];

// export const Header = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isEmailFlow, setIsEmailFlow] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const burgerMenuRef = useRef<HTMLDivElement>(null);
//   const pathname = usePathname();

//   useOutsideClick(
//     burgerMenuRef,
//     useCallback(() => setIsDrawerOpen(false), []),
//   );

//   const handleGoogleSignIn = async () => {
//     // Implement Google sign-in logic here
//     console.log("Google sign-in clicked");
//   };

//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Implement email registration/login logic here
//     console.log("Email:", email, "Password:", password);
//   };

//   const HeaderMenuLinks = () => (
//     <>
//       {menuLinks.map(({ label, href, icon }) => {
//         const isActive = pathname === href;
//         return (
//           <li key={href}>
//             <Link
//               href={href}
//               passHref
//               className={`
//                 ${isActive ? "bg-[#ffffff] shadow-md" : "text-black"}
//                 hover:bg-[#ffffff] hover:shadow-md focus:!bg-[#ffffff] active:!text-neutral 
//                 py-2 px-3 text-sm sm:text-base md:text-lg lg:text-xl rounded-full gap-0.5 grid grid-flow-col 
//                 flex items-center justify-center`}
//             >
//               {icon}
//               <span>{label}</span>
//             </Link>
//           </li>
//         );
//       })}
//     </>
//   );

//   return (
//     <div className="sticky xl:static top-0 navbar bg-[#ffffff] min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
//       <div className="navbar-start w-auto xl:w-1/2">
//         <div className="xl:hidden dropdown" ref={burgerMenuRef}>
//           <label
//             tabIndex={0}
//             className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-white" : "hover:bg-white"}`}
//             onClick={() => {
//               setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
//             }}
//           >
//             <Bars3Icon className="h-1/2" />
//           </label>
//           {isDrawerOpen && (
//             <ul
//               tabIndex={0}
//               className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               onClick={() => {
//                 setIsDrawerOpen(false);
//               }}
//             >
//               <HeaderMenuLinks />
//             </ul>
//           )}
//         </div>
//         <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
//           <div className="flex relative w-[70px] h-[75px]">
//             <Image alt="SE2 logo" className="cursor-pointer" fill src="/file.png" />
//           </div>
//         </Link>
//         <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
//           <HeaderMenuLinks />
//         </ul>
//       </div>
//       <div className="navbar-end flex-grow mr-4">
//         <RainbowKitCustomConnectButton />
//         <FaucetButton />
//         <button
//           className="btn btn-outline ml-4"
//           onClick={() => setIsAuthModalOpen(true)}
//         >
//           登录
//         </button>
//       </div>

//       {isAuthModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-8 w-full max-w-md">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">注册NFT账户</h2>
//               <button
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsAuthModalOpen(false)}
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//             {!isEmailFlow ? (
//               <div className="space-y-4">
//                 <button
//                   className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50"
//                   onClick={handleGoogleSignIn}
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 24 24">
//                     <path
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       fill="#4285F4"
//                     />
//                     <path
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       fill="#34A853"
//                     />
//                     <path
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                       fill="#FBBC05"
//                     />
//                     <path
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       fill="#EA4335"
//                     />
//                   </svg>
//                   <span>使用 Google 账号登录</span>
//                 </button>
//                 <button
//                   className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50"
//                 >
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
//                   </svg>
//                   <span>使用 Apple 登录</span>
//                 </button>
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <span className="w-full border-t border-gray-300" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">或</span>
//                   </div>
//                 </div>
//                 <button
//                   className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
//                   onClick={() => setIsEmailFlow(true)}
//                 >
//                   使用邮箱注册
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleEmailSubmit} className="space-y-4">
//                 <input
//                   type="email"
//                   placeholder="手机号码、邮件地址或用户名"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//                 <input
//                   type="password"
//                   placeholder="密码"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                   下一步
//                 </button>
//                 <button
//                   type="button"
//                   className="w-full text-blue-500 hover:underline"
//                   onClick={() => setIsEmailFlow(false)}
//                 >
//                   返回
//                 </button>
//               </form>
//             )}
//             <div className="mt-4 text-center">
//               <button className="text-blue-500 hover:underline">
//                 忘记密码？
//               </button>
//             </div>
//             <div className="mt-4 text-center text-sm">
//               还没有账号？
//               <button className="ml-1 text-blue-500 hover:underline">
//                 注册
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export const menuLinks: HeaderMenuLink[] = [
//   {
//     label: "",
//     href: "/CreateCollection",
//     icon: <UserIcon className="h-6 w-6 text-black-400" />,

//   },

//   {
//     label: "盲盒市场",
//     href: "/blindMarket",
//     // icon: <ArrowUpTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "碎片化市场",
//     href: "/FragmentationNft",
//     // icon: <ArrowDownTrayIcon className="h-4 w-4" />,
//   },
//   {
//     label: "PeopleModel",
//     href: "/peopleModel",
//     // icon: <BugAntIcon className="h-4 w-4" />,
//   },
//   {
//     label: "空投",
//     href: "/airDrop",
//     // icon: <BugAntIcon className="h-4 w-4" />,
//   },
//   {
//     label: "NFT市场",
//     href: "/marketPlace",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Debug Contracts",
//     href: "/debug",
//     icon: <BugAntIcon className="h-4 w-4" />,
//   },
// ];
// "use client";

// import React, { useCallback, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ArrowDownTrayIcon,
//   CreditCardIcon,
//   UserIcon,
//   ArrowPathIcon,
//   ArrowUpTrayIcon,
//   Bars3Icon,
//   BugAntIcon,
//   PhotoIcon,
//   ShoppingCartIcon,
// } from "@heroicons/react/24/outline";
// import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
// import { useOutsideClick } from "~~/hooks/scaffold-eth";
// import { AuthModal } from "./AuthModal";

// type HeaderMenuLink = {
//   label: string;
//   href: string;
//   icon?: React.ReactNode;
// };

// export const menuLinks: HeaderMenuLink[] = [
//   {
//     label: "",
//     href: "/CreateCollection",
//     icon: <UserIcon className="h-6 w-6 text-black-400" />,
//   },
//   {
//     label: "盲盒市场",
//     href: "/blindMarket",
//   },
//   {
//     label: "碎片化市场",
//     href: "/FragmentationNft",
//   },
//   {
//     label: "PeopleModel",
//     href: "/peopleModel",
//   },
//   {
//     label: "空投",
//     href: "/airDrop",
//   },
//   {
//     label: "NFT市场",
//     href: "/marketPlace",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: <ShoppingCartIcon className="h-4 w-4" />,
//   },
//   {
//     label: "Debug Contracts",
//     href: "/debug",
//     icon: <BugAntIcon className="h-4 w-4" />,
//   },
// ];

// export const HeaderMenuLinks = () => {
//   const pathname = usePathname();

//   return (
//     <>
//       {menuLinks.map(({ label, href, icon }) => {
//         const isActive = pathname === href;
//         return (
//           <li key={href}>
//             <Link
//               href={href}
//               passHref
//               className={`
//                 ${isActive ? "bg-[#ffffff] shadow-md" : "text-black"}
//                 hover:bg-[#ffffff] hover:shadow-md focus:!bg-[#ffffff] active:!text-neutral 
//                 py-2 px-3 text-sm sm:text-base md:text-lg lg:text-xl rounded-full gap-0.5 grid grid-flow-col 
//                 flex items-center justify-center`}
//             >
//               {icon}
//               <span>{label}</span>
//             </Link>
//           </li>
//         );
//       })}
//     </>
//   );
// };

// export const Header = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const burgerMenuRef = useRef<HTMLDivElement>(null);
//   useOutsideClick(
//     burgerMenuRef,
//     useCallback(() => setIsDrawerOpen(false), []),
//   );

//   return (
//     <div className="sticky xl:static top-0 navbar bg-[#ffffff] min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
//       <div className="navbar-start w-auto xl:w-1/2">
//         <div className="xl:hidden dropdown" ref={burgerMenuRef}>
//           <label
//             tabIndex={0}
//             className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-white" : "hover:bg-white"}`}
//             onClick={() => {
//               setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
//             }}
//           >
//             <Bars3Icon className="h-1/2" />
//           </label>
//           {isDrawerOpen && (
//             <ul
//               tabIndex={0}
//               className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               onClick={() => {
//                 setIsDrawerOpen(false);
//               }}
//             >
//               <HeaderMenuLinks />
//             </ul>
//           )}
//         </div>
//         <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
//           <div className="flex relative w-[60px] h-[65px]">
//             <Image alt="SE2 logo" className="cursor-pointer" fill src="/file.png" />
//           </div>
//         </Link>
//         <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
//           <HeaderMenuLinks />
//         </ul>
//       </div>
//       <div className="navbar-end flex-grow mr-4">
//         <RainbowKitCustomConnectButton />
//         <FaucetButton />
//         <AuthModal />
//       </div>
//     </div>
//   );
// };

"use client";
import {AuthModal} from "./AuthModal";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownTrayIcon,
  CreditCardIcon,
  UserIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  BugAntIcon,
  PhotoIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";


type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "",
    href: "/CreateCollection",
    icon: <UserIcon className="h-6 w-6 text-black-400 " />,
  },
  // {
  //   label: "",
  //   href: "/cart",
  //   icon: <ShoppingCartIcon className="h-6 w-6" />,
  // },
  // {
  //   label: "盲盒市场",
  //   href: "/blindMarket",
  // },
  // {
  //   label: "碎片化市场",
  //   href: "/FragmentationNft",
  // },

  // {
  //   label: "PeopleModel",
  //   href: "/peopleModel",
  // },
  {
    label: "空投",
    href: "/airDrop",
  },
  // {
  //   label: "NFT市场",
  //   href: "/marketPlace",
  //   icon: <ShoppingCartIcon className="h-4 w-4" />,
  // },

  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`
                ${isActive ? "bg-[#ffffff] shadow-md" : "text-black"}
                hover:bg-[#ffffff] hover:shadow-md focus:!bg-[#ffffff] active:!text-neutral 
                py-2 px-3 text-sm sm:text-base md:text-lg lg:text-xl rounded-full gap-0.5 grid grid-flow-col 
                flex items-center justify-center`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky xl:static top-0 navbar bg-[#ffffff] min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto xl:w-1/2">
        <div className="xl:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-white" : "hover:bg-white"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
          <div className="flex relative w-[60px] h-[65px]">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/file.png" />
          </div>
        </Link>
        <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
        
        <AuthModal />
      </div>
    </div>
  );
};