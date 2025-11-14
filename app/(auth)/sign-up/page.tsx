"use client";

import React, { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { isValidPassword } from "@/lib/validations";


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

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneInput, setIsPhoneInput] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check if email/phone field contains numbers to switch to phone mode
    if (name === "emailOrPhone") {
      const isNumeric = /^\+?[\d\s-()]*$/.test(value.trim());
      setIsPhoneInput(isNumeric && value.length > 0);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("Sign Up Data:", formData);
    router.push(`/verify`); // Redirect to verify page with identifier
  }

  return (
    <div className="w-full">
      <div className="space-y-3.5 mb-8">
        <p className={`${inter.variable} text-[26px]! leading-8! font-medium  `}>
         Welcome!👋 Get Started With Capcons
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal`}>
          Not a Member? Start a <b>14 day free trial.</b>{" "}
        </p>
      </div>

      {/* sign up form */}

      <form onSubmit={handleSignUp} className="space-y-3">
          {/* Full Name Field */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-4 py-4 text-xs! backdrop-blur-sm border border-[#D9D9D9] outline-0 rounded-xl placeholder-[#5A5A5A] transition-all duration-200"
            />
          </div>

          {/* Email or Phone Field with Netflix-style switching */}
          <div className="relative">
            {isPhoneInput ? (
              <div className="flex space-x-2">
                <div className="relative flex items-center backdrop-blur-sm border border-[#D9D9D9] rounded-xl min-w-20">
                  <span className="absolute left-3">🇮🇳</span>
                  <select className="w-full bg-transparent border-none outline-none pl-8 pr-8 py-4 text-xs! appearance-none">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+65">+65</option>
                  </select>
                  <svg
                    className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <input
                  autoFocus
                  type="tel"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  placeholder="9567989902"
                  className="flex-1 px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
                />
              </div>
            ) : (
              <input
                type="email"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                placeholder="Enter Email or Phone Number"
                className="w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
              />
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a5a4a4]  hover:text-[#b1b1b1] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-3.5 md:size-4 lg:size-5" /> : <Eye className="size-3.5 md:size-4 lg:size-5" />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#E7E7E7]  hover:text-[#b1b1b1] transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-3.5 md:size-4 lg:size-5" /> : <Eye className="size-3.5 md:size-4 lg:size-5" />}
            </button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2">
            <input type="checkbox" name="" id="" className="size-3" />
            <p
              className={`${inter.variable} text-[10px]! font-light! leading-3!`}
            >
              I agree to the  <Link href="/terms" className="underline text-blue-700">Terms & Conditions</Link> and  <Link href="/terms" className="underline text-blue-700">Privacy Policy</Link>{" "}

            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer`}
          >
            Sign Up
          </button>
      </form>
      

      {/* Resend OTP Link */}
      <p
        className={`text-[11px]! ${inter.variable}  font-medium text-center mt-2 cursor-pointer `}
      >
        Send code again <span className="text-[#F52020B2]">00:20</span>
      </p>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#39089D] text-[13px]!  font-normal!"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
