"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navigationItems = [
  { name: "Home", icon: Home, href: "/feed" },
  { name: "Explore", icon: Hash, href: "/explore" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
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
    <aside className="fixed left-0 top-[61px] bottom-0 w-[275px] bg-white dark:bg-[#0D0D0D] border-r border-gray-200 dark:border-[#2D333E] flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
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
                  <Icon size={24} className={isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"} />
                  <span className={`text-lg ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-[#2D333E]">
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl cursor-pointer transition-colors">
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
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{userData?.user_name || "username"}
              </p>
            </div>
          </div>
          <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
        </div>

        {/* Subscribe to Pro Button */}
        <button className="w-full mt-4 px-6 py-3 rounded-full bg-[#39089D] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white font-semibold hover:bg-[#2D067E] transition-colors">
          Subscribe to pro
        </button>
      </div>
    </aside>
  );
}
