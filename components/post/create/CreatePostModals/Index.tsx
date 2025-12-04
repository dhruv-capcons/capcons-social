"use client";

import CreateBox from "../CreateBox";
import { usePostStore } from "@/store/postStore";
// import { useEffect } from "react";

export default function CreatePostModals() {
  const { modalType } = usePostStore();
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


  const RenderModal = () => {
    switch (modalType) {
      case "create":
        return <CreateBox />;
      default:
        return null;
    }
  };

  // if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-[3px]"
      // onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0D0D0D] rounded-xl shadow-xl overflow-hidden mt-40 mx-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {RenderModal()}
        </div>
      </div>
    </div>
  );
}
