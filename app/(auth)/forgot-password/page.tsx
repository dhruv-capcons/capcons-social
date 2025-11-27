"use client";

import React, { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";

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

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    countryCode: "91",
  });

  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();
  const { mutate: forgetPassword, isPending } = useForgotPassword();

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
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

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const forgetPassData = new FormData();
    forgetPassData.append("credential", formData.emailOrPhone);
    if (isPhoneInput) {
      forgetPassData.append("country_code", formData.countryCode);
    }

    forgetPassword(forgetPassData, {
      onSuccess: (data) => {
        router.push(
          `/forgot-password/verify-otp?identifier=${formData.emailOrPhone}&request_id=${data.request_id}`
        );
        console.log("Forgot Password Success:", data);
      },
      onError: (error) => {
        setErrors([error?.response?.data?.message ?? "Failed to send OTP. Please try again."]);
        console.error("Forgot Password Error:", error);
      },
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-1.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium  `}
        >
          Forgot Password?
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal dark:text-[#6C7278]`}>
          Trouble while logging in?
        </p>
      </div>

      {/* forgot password form */}

      <form onSubmit={handleForgotPassword} className="space-y-3">
        {/* Email or Phone Field with Netflix-style switching */}
        <div className="relative">
          {isPhoneInput ? (
            <div className="flex space-x-2">
              <div className="relative flex items-center backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333]  rounded-xl min-w-20">
                <span className="absolute left-3">🇮🇳</span>
                <select
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  name="countryCode"
                  className="w-full bg-transparent border-none outline-none pl-8 pr-8 py-4 text-xs! appearance-none"
                >
                  <option value="91">+91</option>
                  <option value="1">+1</option>
                  <option value="44">+44</option>
                  <option value="65">+65</option>
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
                className="flex-1 px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333]  rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
              />
            </div>
          ) : (
            <input
              type="email"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Enter Email or Phone Number"
              className="w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
            />
          )}
        </div>

        {errors.length > 0 &&<p
          className={`text-[#EE5833] dark:text-[#F7594E] font-medium! ${
            inter.variable
          } text-[10px]! -mt-2 ml-1`}
        >
          {errors.length > 0 ? <>{errors[0]}</> : "Passwords do not match"}
        </p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !formData.emailOrPhone.trim()}
          className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#9E9E9E] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer disabled:cursor-not-allowed`}
        >
          {isPending ? (
            <LoaderCircle className="mx-auto animate-spin size-5 text-[#39089D]" />
          ) : (
            "Send OTP"
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#39089D] text-[13px]! dark:text-[#289DE5]  font-normal!"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
