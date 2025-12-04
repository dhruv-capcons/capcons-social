"use client";

import { motion, AnimatePresence } from "motion/react";
import { Public_Sans, Inter, Mulish } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { useOnboardStore } from "@/store/onboardStore";
import { useUserStore } from "@/store/userStore";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

const gradients = [
  {
    id: "1",
    name: "Purple Pink",
    color: "#08239D",
  },
  {
    id: "2",
    name: "Magenta Pink",
    color: "#39089D",
  },
  {
    id: "3",
    name: "Ocean Blue",
    color: "#9B0004",
  },
  {
    id: "4",
    name: "Warm Sunset",
    color: "#B79202",
  },
  {
    id: "5",
    name: "Soft Blue",
    color: "#015E1E",
  },
];

const CardBgSelection = ({
  onColorChange,
}: {
  onColorChange?: (colorId: string) => void;
}) => {
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const { interests , profileImage } = useOnboardStore();
  const { userData } = useUserStore();

  const handleGradientSelect = (gradient: (typeof gradients)[0]) => {
    setSelectedGradient(gradient);
    onColorChange?.(gradient.id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Card Preview */}
      <AnimatePresence mode="wait">
        <div className="w-full dark:bg-[#47464670] max-w-146 rounded-lg p-4 xmd:p-6 lg:p-10 shadow-md mb-6 lg:mb-12">
          <motion.div
            key={selectedGradient.id}
            initial={{ scale: 1.1, y: -20, x: -5 }}
            animate={{ scale: 1, y: 0, x: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="rounded-[1.8rem] relative flex flex-col justify-between items-start overflow-hidden"
            style={{
              background: selectedGradient.color,
            }}
          >
            <Image
              src="/brandcardpattern.svg"
              alt="brandcardpattern"
              width={200}
              height={200}
              className="w-full h-auto absolute inset-0 object-cover pointer-events-none"
            />

            {/* Profile Section */}
            <div className="flex flex-col items-start gap-2 z-20 relative w-full px-6 py-6 pb-0 xmd:pb-4">
              <Image
                src={profileImage || "/icons/personpic.svg"}
                alt="Profile"
                width={90}
                height={90}
                className="w-20 h-20 xmd:w-23 xmd:h-23 rounded-full object-cover border border-white"
              />
              <div>
                <p
                  className={`${publicSans.variable} text-white text-base xmd:text-[1.85rem]! font-medium`}
                >
                  {userData?.name || "Dhruv Roy"}
                </p>
                <p
                  className={`${inter.variable} text-white text-sm xmd:text-lg! -mt-1.5`}
                >
                  Creative Director
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-[#202530] relative w-full px-6 pt-7 xss:pt-4 pb-6">
              {/* Coin Badge */}
              <div className="absolute top-2 xmd:top-3 right-6 xmd:right-6 flex items-center justify-between gap-0.5 xmd:gap-1">
                <Image
                  src="/icons/capcoin.svg"
                  alt="Coin"
                  width={18}
                  height={18}
                  className="mb-0.5 xmd:w-5 xmd:h-5 xmd:mb-1"
                />
                <span
                  className={`${mulish.variable} text-[#D2D2D2] font-normal text-sm xmd:text-lg`}
                >
                  999
                </span>
              </div>
              <p
                className={`${inter.variable} xss:max-w-2/3 text-white font-light! text-xs! xmd:text-base! leading-4! xmd:leading-5!`}
              >
                A Profession with 10 years of Experience in Content Creation and
                Dance jams.
              </p>

              <div>
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.slice(0, 2).map((interest, index) => (
                      <span
                        key={index}
                        className={`${inter.variable} bg-[#BBBBBB2B] bg-opacity-20 text-white text-[10px] xss:text-xs px-3 py-1.5 rounded-full`}
                      >
                        {interest}
                      </span>
                    ))}
                    <span
                      
                        className={`${inter.variable} bg-[#BBBBBB2B] bg-opacity-20 text-white text-[10px] xss:text-xs px-3 py-1.5 rounded-full`}
                      >
                        {`+${interests.length - 2}`} Interests
                      </span>
                  </div>
                )}  
              </div>

            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Gradient Selection */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 w-full xss: justify-center scrollbar-hide py-2">
        {gradients.map((gradient) => (
          <motion.button
            key={gradient.id}
            onClick={() => handleGradientSelect(gradient)}
            className="relative w-10 h-10 md:w-15 md:h-15 rounded-full cursor-pointer  z-40 shrink-0"
            style={{
              background: gradient.color,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/brandcardpattern.svg"
              alt="brandcardpattern"
              width={400}
              height={400}
              className="w-22! h-22 absolute inset-0 -top-2 object-cover pointer-events-none rounded-full"
            />

            {selectedGradient.id === gradient.id && (
              <motion.div
                layoutId="checkmark"
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full dark:border dark:border-white"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      {/* <span className="text-sm block xs:hidden text-gray-500">
        scroll to see more{" "}
        <MoveRight className="inline-block ml-2 animate-out" />
      </span> */}
    </div>
  );
};

export default CardBgSelection;
