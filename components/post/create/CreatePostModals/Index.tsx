"use client";

import { X } from "lucide-react";
// import { useEffect } from "react";


export default function CreatePostModals() {
  // Handle escape key
  // useEffect(() => {

    // const handleEscape = (e: KeyboardEvent) => {
    //   if (e.key === "Escape") onClose();
    // };

    // if (isOpen) {
    //   document.addEventListener("keydown", handleEscape);
    //   document.body.style.overflow = "hidden";
    // }

  //   return () => {
  //     document.removeEventListener("keydown", handleEscape);
  //     document.body.style.overflow = "unset";
  //   };
  // }, [isOpen, onClose]);

  // if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      // onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0D0D0D] rounded-2xl shadow-xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#272727] bg-white dark:bg-[#0D0D0D]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Post
          </h2>
          <button
            // onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C1C] transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* {children} */}
        </div>
      </div>
    </div>
  );
}
