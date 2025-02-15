"use client";

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Redirect to dashboard if the user is authorized
  useEffect(() => {
    if (isLoaded) {
      try {
        if (user?.primaryEmailAddress?.emailAddress === "abihaahmed413@gmail.com") {
          router.push("/dashboard"); // Redirect if admin
        }
      } catch  {
        setError("An unexpected error occurred during redirection."); // Handle errors
      }
    }
  }, [user, router, isLoaded]);

  // Show loading spinner while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="loader mb-4"></div>
          <p className="text-lg font-medium text-white">Authenticating, please wait...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
      {/* Main Heading */}
      <motion.h1
        className="text-5xl font-extrabold text-white mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-yellow-400">SHOP.CO</span>
      </motion.h1>

      {/* Error Message (if any) */}
      {error && (
        <motion.div
          className="bg-red-100 text-red-800 px-4 py-2 rounded mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      {/* Admin Login Section */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <SignedOut>
          <SignInButton>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition duration-200 shadow-md">
              Login With Clerk
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition duration-200 shadow-md">
              Sign Out With Clerk
            </button>
          </SignOutButton>
        </SignedIn>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-white text-sm font-light"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        © 2025 SHOP.CO. All rights reserved.
      </motion.div>
    </div>
  );
}
