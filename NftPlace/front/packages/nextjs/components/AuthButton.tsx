// "use client"

// import * as React from "react"
// import { AuthModal } from "./AuthModal"

// export function AuthButton() {
//   const [isOpen, setIsOpen] = React.useState(false)

//   return (
//     <>
//       <button
//         className="rounded-full px-4 py-2 text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
//         onClick={() => setIsOpen(true)}
//       >
//         登录
//       </button>
//       <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </>
//   )
// }
// "use client"

// import * as React from "react"

// import { X } from "lucide-react"

// export function AuthButton() {
//   return (
//     <button
//       className="rounded-full px-4 py-2 text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
//       onClick={() => window.location.href = '/login'}
//     >
//       登录
//     </button>
//   )
// }
// "use client";

import { useRouter } from "next/navigation";

export function AuthButton() {
  const router = useRouter();

  return (
    <button
      className="rounded-full px-4 py-2 text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
      onClick={() => router.push("/auth?view=login")}
    >
      登录
    </button>
  );
}