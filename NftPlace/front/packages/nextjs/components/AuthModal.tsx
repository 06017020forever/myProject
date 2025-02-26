// "use client"

// import * as React from "react"
// import { X } from "lucide-react"
// import Link from "next/link"

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function AuthModal({ isOpen, onClose }: AuthModalProps) {
//   const [isEmailFlow, setIsEmailFlow] = React.useState(false)
//   const [email, setEmail] = React.useState("")
//   const [password, setPassword] = React.useState("")
//   const [isSignUp, setIsSignUp] = React.useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     // Handle login/signup logic here
//     console.log(isSignUp ? "Signup" : "Login", "attempt with:", email)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="h-6 w-6" />
//         </button>

//         <div className="space-y-6">
//           <div className="text-center">
//             <X className="h-8 w-8 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold">
//               {isSignUp ? "创建你的账号" : "登录 X"}
//             </h1>
//           </div>

//           <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-black rounded-full p-2.5 font-medium hover:bg-gray-50 transition-colors">
//             <svg className="h-5 w-5" viewBox="0 0 24 24">
//               <path
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 fill="#4285F4"
//               />
//               <path
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 fill="#34A853"
//               />
//               <path
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 fill="#FBBC05"
//               />
//               <path
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 fill="#EA4335"
//               />
//             </svg>
//             使用 Google 账号{isSignUp ? "注册" : "登录"}
//           </button>

//           <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-black rounded-full p-2.5 font-medium hover:bg-gray-50 transition-colors">
//             <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
//             </svg>
//             使用 GitHub {isSignUp ? "注册" : "登录"}
//           </button>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">或</span>
//             </div>
//           </div>

//           {isEmailFlow ? (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="手机号码、邮件地址或用户名"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-3 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
//               />
//               <input
//                 type="password"
//                 placeholder="密码"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-3 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-black text-white rounded-full p-3 font-bold hover:bg-gray-800 transition-colors"
//               >
//                 {isSignUp ? "注册" : "登录"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEmailFlow(false)}
//                 className="w-full text-blue-500 hover:underline"
//               >
//                 返回
//               </button>
//             </form>
//           ) : (
//             <button
//               onClick={() => setIsEmailFlow(true)}
//               className="w-full border border-gray-300 text-black rounded-full p-2.5 font-medium hover:bg-gray-50 transition-colors"
//             >
//               使用邮箱{isSignUp ? "注册" : "登录"}
//             </button>
//           )}

//           {!isEmailFlow && (
//             <button className="w-full text-blue-500 hover:underline">
//               忘记密码？
//             </button>
//           )}

//           <div className="text-center text-gray-600">
//             {isSignUp ? "已经有账号了？" : "还没有账号？"}{" "}
//             <button
//               onClick={() => setIsSignUp(!isSignUp)}
//               className="text-blue-500 hover:underline"
//             >
//               {isSignUp ? "登录" : "注册"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import * as React from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export function AuthModal() {
  const [isOpen, setIsOpen] = React.useState(false); // State to track if modal is open
  const [view, setView] = React.useState<"login" | "signup">("login"); // State to track which view (login or signup) is shown

  return (
    <>
      {/* This button will remain visible even when modal is open */}
   
        <button
          style={{
            height: "2.5rem",
            width: '8%',
            padding: '0.5rem',
            backgroundColor: 'white',
            color: 'black',
            border: '2px solid gray',
            borderRadius: '2rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(true)}
        >
          登录
        </button>
 

      {/* Modal window */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)} // Close modal when clicking outside
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-black p-6 rounded-xl shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-full"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Render either login or signup form based on the current view */}
            {view === "login" ? (
              <LoginForm onSwitchToSignUp={() => setView("signup")} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setView("login")} />
            )}
          </div>
        </>
      )}
    </>
  );
}
