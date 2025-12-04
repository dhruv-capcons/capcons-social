"use client";

import { useUserStore } from "@/store/userStore";
import { MoreHorizontal, SearchIcon } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const Feed = () => {
  const { userData } = useUserStore();

  return (
    <div className="w-full min-h-[calc(svh-60px)] grid grid-cols-4 gap-3 ">

      {/* first */}
      <div className="col-span-3">
        <div className="flex border-b-[0.1px]! border-[#CAC7C7] dark:border-[#2D333E] px-5 pb-4 pt-5 items-start justify-between gap-3">
          <div className="shrink-0">
            <Image
              src={userData?.pfp_url || "/defaultuser.webp"}
              width={40}
              height={40}
              alt="Profile Picture"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          <div className="flex-1">
            <textarea
              className="w-full border-0 ring-0 resize-none text-base placeholder-gray-500 dark:placeholder-gray-400 bg-transparent outline-0 font-normal leading-6 dark:text-white"
              placeholder="What's happening?"
              rows={2}
            />
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
          </div>

          <div className="mt-6">
            <button
              className={`${inter.className} font-medium text-xs bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#C1C1C2] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] shadow-xs shadow-[#0A0D120D] text-white px-6 py-3 rounded-3xl mx-auto! cursor-pointer disabled:cursor-not-allowed`}
            >
              Tweet
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b-[0.1px]! border-[#CAC7C7] dark:border-[#2D333E] p-5 overflow-x-auto">
         
         {[1,2,3,4].map((_,index) => (
          <div key={index} className="w-fit flex flex-col items-center justify-center p-4 border border-[#DBDFE4] dark:border-[#2D333E] rounded-xl gap-3">
            <h3 className={`${inter.className} font-semibold! text-base! whitespace-nowrap`}>
              Get Pro! Unlock More
            </h3>
            <Image src="/cards.png" alt="cards" width={250} height={200} className="w-72 h-auto" />
            <button
              className={`${inter.className} font-medium text-xs bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#C1C1C2] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] shadow-xs shadow-[#0A0D120D] text-white px-6 py-3 rounded-xl w-full  mx-auto! cursor-pointer disabled:cursor-not-allowed`}
            >
              Unlock
            </button>
          </div>
          ))}


        </div>
      </div>

      {/* second */}
      <div className="col-span-1 p-4 space-y-4">

          {/* Search bar */}
        <div className="relative flex items-center justify-center gap-2 border-[0.5px] border-[#CAC7C7] dark:border-[#2D333E] rounded-3xl w-full px-5 py-3">
          <SearchIcon className=" dark:text-white size-4" />
          <input type="text" name="" id="" placeholder="Search" className="w-full bg-transparent ring-0 border-0 outline-none dark:text-white" />
        </div>

        <div className="bg-[#FAFBFC] rounded-3xl">
          <h2 className={`${inter.className} font-semibold! text-base! p-4 px-6 border-b border-[#E1E4E8]`}>
            Recommended Circles
          </h2>
          {[1,2].map((_,index) => (
            <div key={index} className="p-4 border-b border-[#E1E4E8] flex items-center justify-start gap-3">
              <Image src="/defaultuser.webp" alt="circle" width={40} height={40} className="w-10 h-auto rounded-full" />
              <div className="flex items-center justify-between w-full">
                <div>
                <p className="text-[15px]! font-semibold" >Elon Musk</p>
                <p className="text-xs! font-normal text-[#5B7083] -mt-1.5 ">@elonmusk</p>
              </div>
              <button className="text-xs! border border-[#5D35AF] text-[#5D35AF] px-3 py-2 rounded-3xl cursor-pointer">
                Follow
              </button>
              </div>
            </div>
          ))}
           <p className={`${inter.className} font-semibold! text-base! p-4 px-6 text-[#1DA1F2]`}>
            Show more
          </p>

        </div>


        <div className="bg-[#FAFBFC] rounded-3xl">
          <h2 className={`${inter.className} font-semibold! text-base! p-4 px-6 border-b border-[#E1E4E8]`}>
           What’s happening
          </h2>
          {[1,2].map((_,index) => (
            <div key={index} className="p-4 border-b border-[#E1E4E8] flex items-center justify-start gap-3">
              <div>
                  <div>
                    
                  </div>
                  <button>
                    <MoreHorizontal />
                  </button>
              </div>
            </div>
          ))}
           <p className={`${inter.className} font-semibold! text-base! p-4 px-6 text-[#1DA1F2]`}>
            Show more
          </p>

        </div>


      </div>


    </div>
  );
};

export default Feed;
