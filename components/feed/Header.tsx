"use client";

import Image from "next/image";
import { Search, Bell } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function Header() {
  const { userData } = useUserStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0D0D0D] border-b border-gray-200 dark:border-[#2D333E]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/feed">
          <Image
            src="/capconsvg.svg"
            alt="Capcons logo"
            width={200}
            height={52}
            className="h-10 w-auto mb-15 xmd:mb-0 dark:hidden"
            unoptimized
          />
          <Image
            src="/capconsdark.svg"
            alt="Capcons logo"
            width={200}
            height={52}
            className="h-10 w-auto mb-15 xmd:mb-0 hidden dark:block"
            unoptimized
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Search size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* Notifications Icon */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {userData?.pfp_url ? (
                <Image
                  src={userData.pfp_url}
                  alt={userData.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {userData?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{userData?.user_name || "username"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
