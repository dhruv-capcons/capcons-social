"use client";

import { motion, AnimatePresence } from "motion/react";
import { Public_Sans, Inter, Mulish } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";


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
    gradient:
      "linear-gradient(145.01deg, #3F2970 5.76%, #322258 41.08%, #7F2A69 82.59%)",
  },
  {
    id: "2",
    name: "Magenta Pink",
    gradient:
      "linear-gradient(149.83deg, #AB001F 10.88%, #9F0C85 44.96%, #9AA6AD 83.65%)",
  },
  {
    id: "3",
    name: "Ocean Blue",
    gradient: "linear-gradient(144.25deg, #274A76 10.88%, #3A7D98 77.09%)",
  },
  {
    id: "4",
    name: "Warm Sunset",
    gradient:
      "linear-gradient(147.09deg, #792316 10.68%, #A07078 45.24%, #92737C 58.24%, #448790 83.89%)",
  },
  {
    id: "5",
    name: "Soft Blue",
    gradient:
      "linear-gradient(147.26deg, #D5D5DA 13%, #B2C8D4 45.27%, #69A6C1 85.26%)",
  },
  {
    id: "6",
    name: "Golden Hour",
    gradient:
      "linear-gradient(147.26deg, #8B9EA5 13%, #BDAE90 45.27%, #BD8758 85.26%)",
  },
  {
    id: "7",
    name: "Mint Fresh",
    gradient:
      "linear-gradient(147.26deg, #D1DCDC 13%, #E1EAE7 45.27%, #95CDD2 85.26%)",
  },
];

const CardBgSelection = ({
  onColorChange,
}: {
  onColorChange?: (colorId: string) => void;
}) => {
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);

  const handleGradientSelect = (gradient: typeof gradients[0]) => {
    setSelectedGradient(gradient);
    onColorChange?.(gradient.id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Card Preview */}
      <AnimatePresence mode="wait">
        <div className="w-full dark:bg-[#47464670] max-w-146 rounded-lg p-4 xmd:p-10 shadow-xl mb-6 xmd:mb-12 overflow-hidden">
          <motion.div
            key={selectedGradient.id}
            initial={{ scale: 1.1, y: -20, x: -5 }}
            animate={{ scale: 1, y: 0, x: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="rounded-lg relative px-4 xmd:px-9 pt-6 xmd:pt-10 pb-2 xmd:pb-4 aspect-[1.7/1]"
            style={{
              background: selectedGradient.gradient,
            }}
          >
            {/* Coin Badge */}
            <div className="absolute top-2 xmd:top-3 right-3 xmd:right-6 flex items-center justify-between gap-0.5 xmd:gap-1">
              <Image
                src="/icons/capcoin.svg"
                alt="Coin"
                width={20}
                height={20}
                className="mb-0.5 xmd:w-[29px] xmd:h-[29px] xmd:mb-1"
              />
              <span
                className={`${mulish.variable} text-[#D2D2D2] font-normal text-sm xmd:text-xl`}
              >
                000
              </span>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 xmd:gap-6 mb-4 xmd:mb-8">
              <Image
                src="/icons/personpic.svg"
                alt="Profile"
                width={60}
                height={60}
                className="xmd:w-24 xmd:h-24"
              />
              <div>
                <p
                  className={`${publicSans.variable} text-white text-base xmd:text-[1.4rem]! font-medium`}
                >
                  Dhruv Roy
                </p>
                <p className={`${inter.variable} text-white text-sm xmd:text-lg! -mt-1 xmd:-mt-1.5`}>
                  @Content creator
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <p
              className={`${inter.variable} text-white text-xs xmd:text-lg! leading-4 xmd:leading-6! mb-4 xmd:mb-8`}
            >
              A Profession with 10 years of Experience in Content Creation and
              Dance jams.
            </p>

            {/* Divider */}
            <div className="h-[0.5px] bg-[#C5C5C5]" />

            {/* Stats Placeholder */}
            <div className="flex items-center justify-center mt-1 xmd:mt-2">
              <div className="h-6 xmd:h-10 w-[0.5px] bg-[#C5C5C5]" />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Gradient Selection */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full sm:justify-center scrollbar-hide py-2">
        {gradients.map((gradient) => (
          <motion.button
            key={gradient.id}
            onClick={() => handleGradientSelect(gradient)}
            className="relative w-16 h-16 rounded-full cursor-pointer shadow-lg z-40 shrink-0"
            style={{
              background: gradient.gradient,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
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
      <span className="text-sm block sm:hidden text-gray-500">
         scroll to see more <MoveRight className="inline-block ml-2 animate-out" />
      </span>
     
    </div>
  );
};

export default CardBgSelection;
