"use client";

import { Inter, Public_Sans } from "next/font/google";
import { X, RotateCcw, Minus, Plus } from "lucide-react";
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
  const [zoom, setZoom] = useState(1);
  const applyRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const minZoom = 0.5;
  const maxZoom = 3;

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

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, minZoom));
  };

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
             <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}>
                <ImageCropContent className="max-h-full max-w-full" />
              </div>
            </div>
          </div>

          {/* Hidden action buttons */}
          <div className="hidden">
            <ImageCropApply ref={applyRef} />
            <ImageCropReset ref={resetRef} />
          </div>

          {/* Zoom Controls */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
                className="p-1 rounded-full border border-black dark:border-[#E1E3E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} className="sm:w-5 sm:h-5" />
              </button>

              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 appearance-none cursor-pointer rounded-full custom-range"
                style={
                  {
                    "--progress": `${
                      ((zoom - minZoom) / (maxZoom - minZoom)) * 100
                    }%`,
                  } as React.CSSProperties
                }
              />

              <button
                onClick={handleZoomIn}
                disabled={zoom >= maxZoom}
                className="p-1 rounded-full border border-black dark:border-[#E1E3E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 sm:p-6 pt-4 sm:pt-6">
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
