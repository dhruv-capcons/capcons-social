"use client";

import {Montserrat} from "next/font/google";
import Link from "next/link";
import { Inter } from "next/font/google";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    display: "swap",
});

const WelcomePage = () => {
  return (
    <div className={`${inter.variable} min-h-screen bg-white dark:bg-[#101010] flex flex-col`}>
      {/* Header */}
      <header className="text-center mb-12 py-8 px-6">
        <h1 className="text-6xl xmd:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#6941C6] to-[#9E77ED] bg-clip-text text-transparent">
            CapCons.
          </span>
        </h1>
        <p className="text-lg xmd:text-xl text-gray-700 dark:text-gray-300">
          Built to power{" "}
          <span className="text-[#6941C6] font-semibold">creators</span>,{" "}
          <span className="text-[#6941C6] font-semibold">communities</span>, and{" "}
          <span className="text-black dark:text-white font-semibold">cultures</span> of tomorrow.
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 pb-12 w-full">
        {/* Greeting */}
        <h2 className="text-3xl font-semibold mb-4">
          Hi Anshika,{" "}
          <span className="inline-block animate-wave">👋</span>
        </h2>

        {/* Welcome Message */}
        <div className="mb-8 space-y-3">
          <p className="text-base text-gray-700 dark:text-gray-300">
            Welcome to CapCons! We&apos;re excited to have you on board.
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300">
            Your account has been successfully registered, and you&apos;re now part of
            our <span className="font-semibold text-black dark:text-white">community</span>.
          </p>
        </div>

        {/* Next Steps */}
        <h3 className="text-lg font-semibold mb-6">Here&apos;s what you can do next:</h3>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 xmd:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-gray-50 dark:bg-[#1C1C1C] rounded-2xl p-6 text-center border border-gray-200 dark:border-[#333333]">
            <div className="w-12 h-12 bg-white dark:bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-[#333333]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6941C6]"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-base mb-2">Explore Key Features</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover the core tools and interactions that make your product stand out.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 dark:bg-[#1C1C1C] rounded-2xl p-6 text-center border border-gray-200 dark:border-[#333333]">
            <div className="w-12 h-12 bg-white dark:bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-[#333333]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6941C6]"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-base mb-2">Complete your profile</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add essential details to strengthen your presence and improve discoverability.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 dark:bg-[#1C1C1C] rounded-2xl p-6 text-center border border-gray-200 dark:border-[#333333]">
            <div className="w-12 h-12 bg-white dark:bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-[#333333]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6941C6]"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-base mb-2">Dive into Capcons</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore fresh ideas and innovative methods to build something unique.
            </p>
          </div>
        </div>

        {/* Community Message */}
        <p className="text-base text-gray-700 dark:text-gray-300 mb-8">
          You&apos;re now part of a growing community of over{" "}
          <span className="font-semibold text-black dark:text-white">4000 creators</span>. The best way to get
          started? Jump in, experiment, and bring your ideas to life.
        </p>

        {/* Sign Off */}
        <div className="mb-8">
          <p className="text-base text-gray-700 dark:text-gray-300">Cheers,</p>
          <p className="text-base font-semibold text-black dark:text-white">
            The Capcons Team
          </p>
        </div>

        {/* Get Started Button */}
        <Link
          href="/dashboard"
          className="block w-full bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white text-center font-semibold py-4 rounded-2xl transition-all duration-200"
        >
          Get Started
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#39089D] text-white py-12 mt-auto rounded-t-3xl relative overflow-hidden">
        <p style={{fontFamily: montserrat.style.fontFamily}} className={`${montserrat.variable}  text-[5rem]! xss:text-[7.5rem]! sm:text-[10rem]! md:text-[12rem]! xmd:text-[14rem]! xl:text-[17rem]! font-bold! leading-none! select-none! opacity-10 pointer-events-none absolute! bottom-0!  sm:-bottom-4! xl:-bottom-7! left-1/2 transform -translate-x-1/2 whitespace-nowrap!`}>Capcons.</p>
        <div className="mx-auto px-6">
          {/* Footer Text */}
          <p className="text-center text-sm mb-6 leading-relaxed">
            Explore ideas, stories, and expert insights from creators, innovators, and
            businesses. Stay informed, get inspired, and join the conversation.
          </p>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Google"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/terms" className="hover:underline">
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <Link href="/careers" className="hover:underline">
              Careers
            </Link>
            <Link href="/faqs" className="hover:underline">
              FAQs
            </Link>
            <Link href="/media" className="hover:underline">
              Media
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .animate-wave {
          animation: wave 2s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
