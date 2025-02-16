"use client";

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Ensure NEXT_PUBLIC_ADMIN_PASSWORD is set in your .env file.
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsPasswordValid(true);
      setError(null);
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "true");
      }
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  // Redirect if Clerk user is admin or password is validated.
  useEffect(() => {
    if (isLoaded) {
      if (
        user?.primaryEmailAddress?.emailAddress === "abihaahmed413@gmail.com" ||
        isPasswordValid
      ) {
        router.push("/dashboard");
      }
    }
  }, [isLoaded, user, isPasswordValid, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="loader mb-4" />
          <p className="text-lg font-medium text-white">Authenticating, please wait...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
      <motion.h1
        className="text-5xl font-extrabold text-white mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-yellow-400">SHOP.CO</span>
      </motion.h1>

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

      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        <SignedOut>
          <SignInButton>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition duration-200 shadow-md mb-4">
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

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition duration-200 shadow-md"
          >
            Login With Password
          </button>
        </form>
      </motion.div>

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
