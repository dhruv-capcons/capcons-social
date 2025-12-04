"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useUserStore } from "@/store/userStore";
import { X } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const CreateBox = () => {
  const { userData } = useUserStore();

  return (
    <>
      <div className="px-3 pt-3 flex items-center justify-between">
        <button
          // onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C1C] transition-colors cursor-pointer"
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>

        <button className="p-2 border-0 outline-none focus:ring-0 transition-colors text-[#39089D] font-semibold text-sm cursor-pointer">
          Drafts
        </button>
      </div>


      <div className="flex px-7 pb-4 pt-2 items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-3 border-b-[0.1px]! border-[#CAC7C7] dark:border-[#2D333E]">
            <Image
              src={userData?.pfp_url || "/defaultuser.webp"}
              width={40}
              height={40}
              alt="Profile Picture"
              className="w-10 h-10 rounded-full object-cover"
            />

            <textarea
              autoFocus
              className="w-full border-0 ring-0 pt-1.5 pb-1 resize-none text-base placeholder-gray-500 dark:placeholder-gray-400 bg-transparent outline-0 font-normal leading-6 dark:text-white"
              placeholder="What's happening?"
              rows={4}
            />
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <div className="w-fit flex items-end justify-between gap-5">
              <Image
                src="/icons/post/pic.svg"
                width={15}
                height={15}
                alt="Add Image"
                className="inline-block cursor-pointer"
              />
              <Image
                src="/icons/post/gif.svg"
                width={15}
                height={15}
                alt="Add Image"
                className="inline-block cursor-pointer"
              />
              <Image
                src="/icons/post/threeline.svg"
                width={15}
                height={15}
                alt="Add Image"
                className="inline-block cursor-pointer"
              />
              <Image
                src="/icons/post/emoji.svg"
                width={17}
                height={17}
                alt="Add Image"
                className="inline-block cursor-pointer"
              />
              <Image
                src="/icons/post/bag.svg"
                width={15}
                height={15}
                alt="Add Image"
                className="inline-block cursor-pointer"
              />
            </div>

            <button
              className={`${inter.className} font-medium text-xs bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#C1C1C2] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] shadow-xs shadow-[#0A0D120D] text-white px-6 py-3 rounded-3xl cursor-pointer disabled:cursor-not-allowed`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBox;
