"use client";

import { Inter, Public_Sans } from "next/font/google";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const minZoom = 0;
  const maxZoom = 3;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, minZoom));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate bounds to prevent dragging outside container
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const maxX = Math.max(
        0,
        (imageDimensions.width * zoom - containerRect.width) / 2
      );
      const maxY = Math.max(
        0,
        (imageDimensions.height * zoom - containerRect.height) / 2
      );

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const handleSave = () => {
    if (containerRef.current && imageRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const containerRect = containerRef.current.getBoundingClientRect();

      // Set canvas size to match the visible container
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;

      if (ctx) {
        // Create a temporary image to draw on canvas
        const tempImg = new window.Image();
        tempImg.crossOrigin = "anonymous";
        
        tempImg.onload = () => {
          // Calculate the position and size based on current zoom and position
          const scaledWidth = imageDimensions.width * zoom;
          const scaledHeight = imageDimensions.height * zoom;
          
          // Calculate centered position with offset
          const x = (containerRect.width - scaledWidth) / 2 + position.x;
          const y = (containerRect.height - scaledHeight) / 2 + position.y;

          // Draw the image with current transformations
          ctx.drawImage(
            tempImg,
            x,
            y,
            scaledWidth,
            scaledHeight
          );

          // Convert canvas to image data
          const croppedImage = canvas.toDataURL("image/jpeg", 0.95);
          onSave(croppedImage);
          onClose();
        };
        
        tempImg.src = imageSrc;
      }
    }
  };

  const resetAdjustments = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    // Schedule reset on the next tick to avoid synchronous setState inside the effect
    const id = window.setTimeout(() => {
      resetAdjustments();
    }, 0);
    return () => window.clearTimeout(id);
  }, [imageSrc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D0D0D] rounded-lg w-full max-w-134 h-130 overflow-hidden">
        {/* Header */}
        <div className="flex justify-start items-center p-6 pb-5">
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors cursor-pointer "
          >
            <X size={34} className="text-[#CBCCCC]" />
          </button>
          <p
            className={`${publicSans.variable} font-semibold! text-[1.85rem]! dark:text-[#DCE0E6]`}
          >
            Adjust
          </p>
        </div>

        {/* Image Container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-119 h-78 mx-auto overflow-hidden rounded-lg border-[#D0D5DD] dark:border-[#2D333E] border border-dashed"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute top-1/2 left-1/2 cursor-move"
            style={{
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.2s ease",
              transformOrigin: "center center",
            }}
          >
            <Image
              ref={imageRef}
              src={imageSrc}
              alt="Profile preview"
              width={imageDimensions.width || 500}
              height={imageDimensions.height || 500}
              onLoad={handleImageLoad}
              className="max-w-none"
              style={{
                width: imageDimensions.width || "auto",
                height: imageDimensions.height || "auto",
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
                className="p-1 rounded-full border border-black dark:border-[#E1E3E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={20} />
              </button>

              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-60! h-2 appearance-none cursor-pointer rounded-full custom-range"
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
                <Plus size={18} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`${inter.variable} px-12 py-3 rounded-3xl bg-[#39089D] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white hover:bg-[#2D067E] transition-colors cursor-pointer`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
