"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter, Roboto } from "next/font/google";
import Image from "next/image";
import { 
  Home, 
  Hash, 
  Bell, 
  Mail, 
  Bookmark, 
  FileText, 
  User, 
  MoreHorizontal 
} from "lucide-react";
import { useUserStore } from "@/store/userStore";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const navigationItems = [
  { name: "Home", icon: Home, href: "/feed" },
  { name: "Explore", icon: Hash, href: "/explore" },
  { name: "Messages", icon: Mail, href: "/messages" },
  { name: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { name: "Lists", icon: FileText, href: "/lists" },
  { name: "Profile", icon: User, href: "/profile" },
  { name: "More", icon: MoreHorizontal, href: "/more" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { userData } = useUserStore();

  return (
    <aside className="fixed left-0 top-[60px] bottom-0 w-65 px-4 bg-white dark:bg-[#0D0D0D] border-r border-gray-200 dark:border-[#2D333E] flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 font-semibold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"} />
                  <span className={`${inter.className} font-normal text-base ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="mb-8 px-3">
        <div className="flex items-center justify-between p-3  transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
            <div className="flex-1 min-w-0">
              <p className={`${roboto.className} text-sm! font-semibold text-[#0F1419] dark:text-white truncate`}>
                {userData?.name || "User"}
              </p>
              <p className={`${roboto.className} text-xs! text-[#5B7083] dark:text-gray-400 truncate`}>
                @{userData?.user_name || "username"}
              </p>
            </div>
          </div>
          <div className="cursor-pointer">
          <MoreHorizontal size={20} className="text-[#0F1419] dark:text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Subscribe to Pro Button */}
        <button className={`w-full ${inter.className} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#C1C1C2] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer disabled:cursor-not-allowed`}>
          Subscribe to pro
        </button>
      </div>
    </aside>
  );
}
