"use client";

import { Inter, Public_Sans } from "next/font/google";
import { X, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ImageCrop, ImageCropContent, ImageCropApply, ImageCropReset } from "@/components/ui/shadcn-io/image-crop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const ImageZoomModal = ({
  isOpen,
  onClose,
  imageSrc,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (croppedImage: string) => void;
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const applyRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (imageSrc) {
      // Convert base64 or URL to File object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" });
          setImageFile(file);
        })
        .catch(err => console.error("Error converting image:", err));
    }
  }, [imageSrc]);

  if (!isOpen || !imageFile) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D0D0D] rounded-lg w-full max-w-[536px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-start items-center p-4 sm:p-6 pb-3 sm:pb-5">
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={28} className="text-[#CBCCCC] sm:w-[34px] sm:h-[34px]" />
          </button>
          <p
            className={`${publicSans.variable} font-semibold text-xl sm:text-[1.85rem] dark:text-[#DCE0E6]`}
          >
            Adjust
          </p>
        </div>

        {/* Image Crop Container */}
        <ImageCrop
          file={imageFile}
          aspect={1}
          onCrop={(croppedImage) => {
            onSave(croppedImage);
            onClose();
          }}
        >
          <div className="w-full px-4 sm:px-6">
            <div className="relative w-full h-[250px] sm:h-[312px] mx-auto overflow-hidden rounded-lg border-[#D0D5DD] dark:border-[#2D333E] border border-dashed flex items-center justify-center">
              <ImageCropContent className="max-h-full max-w-full" />
            </div>
          </div>

          {/* Hidden action buttons */}
          <div className="hidden">
            <ImageCropApply ref={applyRef} />
            <ImageCropReset ref={resetRef} />
          </div>

          {/* Controls */}
          <div className="p-4 sm:p-6 pt-6 sm:pt-8">
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <button
                onClick={() => resetRef.current?.click()}
                className="p-2 rounded-full border border-black dark:border-[#E1E3E5] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Reset crop"
              >
                <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => applyRef.current?.click()}
                className={`${inter.variable} px-8 sm:px-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-3xl bg-[#39089D] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white hover:bg-[#2D067E] transition-colors cursor-pointer`}
              >
                Save
              </button>
            </div>
          </div>
        </ImageCrop>
      </div>
    </div>
  );
};

export default ImageZoomModal;
