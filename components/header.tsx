"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-up" || pathname === "/login" || pathname === "/verify";

  if(isAuthPage) {
    return null;
  }

  return (
    <>
      <header className="bg-white relative z-20">
        <div className="flex items-center justify-between py-4 px-4 sm:px-14 max-w-7xl mx-auto">
          <div className="hidden md:block">
            <Image
              src="https://assets.capcons.com/images/logo-footer.png"
              alt="Capcons logo"
              width={200}
              height={52}
              className="h-12 w-auto"
              unoptimized
            />
          </div>

          {/* Left: Hamburger on mobile, Navigation on desktop */}
          <div className="flex items-center">
            <button
              aria-label="Open menu"
              className="md:hidden p-2 rounded-md text-black hover:bg-gray-100"
              onClick={() => setIsMenuOpen(true)}
            >
              <FaBars size={20} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[#000000] font-sans font-medium">
              <Link
                href="/features"
                className="text-[var(--color-footer-text)] transition-colors hover:text-primary text-lg"
              >
                Features
              </Link>
              <button className="flex items-center gap-2 transition-colors hover:text-primary text-lg">
                Resources <FaChevronDown className="size-3" />
              </button>
              <Link
                href="/pricing"
                className="text-[var(--color-footer-text)] transition-colors hover:text-primary text-lg"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Center: Logo (absolutely centered on mobile) */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
            <Image
              src="https://assets.capcons.com/images/logo-footer.png"
              alt="Capcons logo"
              width={200}
              height={52}
              className="h-10 w-auto"
              unoptimized
            />
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:inline text-black text-lg font-sans font-medium cursor-pointer">
              Log in
            </Link>
            <Link href="/sign-up" className="bg-[#C6F806] sm:text-lg text-black font-sans font-medium px-4 sm:px-7 py-2 sm:py-[0.9rem] rounded-full cursor-pointer">
              Signup
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Slider */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Bottom Slider with Curved Top Borders */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 right-0 bottom-0 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200">
          <div className="px-6 py-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Menu</h2>
              <button
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-6">
              <Link
                href="/features"
                className="text-black text-lg font-medium py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <button
                className="flex items-center justify-between text-black text-lg font-medium py-3 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources <FaChevronDown />
              </button>
              <Link
                href="/pricing"
                className="text-black text-lg font-medium py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
            </nav>

            {/* Mobile Auth buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/login" className="text-black text-lg font-sans font-medium py-3 text-left">
                Log in
              </Link>
              <Link href="/sign-up" className="bg-[#C6F806] text-lg text-black font-sans font-medium px-7 py-4 rounded-full w-full">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
