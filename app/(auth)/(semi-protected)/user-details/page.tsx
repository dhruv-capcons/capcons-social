"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";
import {useOnboardingGeneral} from "@/hooks/useOnboard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


const UserDetails = () => {
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    description: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const router = useRouter();
  const { mutate: updateUserProfile, isPending } = useOnboardingGeneral();
  const handleUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle user details submission logic here
    updateUserProfile(formData, {
      onSuccess: () => {
        router.push("/onboarding");
      },
      onError: (error) => {
        setErrors([error.message]);
      },
    });
  }


  return (
    <div className="w-full">
      <div className="space-y-1.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium  `}
        >
            Create Username
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal dark:text-[#6C7278]`}>
          Create your unique username
        </p>
      </div>

      {/* sign up form */}

      <form onSubmit={handleUserDetails} className="space-y-3">
        {/* Username field */}
        <div className="relative">
          
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Eg. dhruv_roy"
              className="w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
            />
          
        </div>

        {/* DOB Field */}
        <DatePicker
          value={formData.dob}
          onChange={(date) => setFormData((prev) => ({ ...prev, dob: date }))}
          placeholder="Date of Birth"
        />

        {/* Description Field */}
        <div className="relative">
          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Hello! I am a life enthusiast, a tech enthusiast and a content creator."
            className={`w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] rounded-xl placeholder-[#5A5A5A] transition-all duration-200 resize-none`}
          />
        </div>

        {errors.length > 0 && (
          <p
            className={`text-[#EE5833] font-medium! ${inter.variable} text-[10px]! -mt-2 ml-1 `}
          >
            {errors[0]}
          </p>
        )}

        {/* Max words */}
        <div className="flex items-center gap-2 -mt-2">
          <p
            className={`${inter.variable} text-[11px]! font-light! leading-3! text-[#1A91DA]`}
          >
            Max 50 words
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer`}
        >
          {isPending ? (
            <LoaderCircle className="mx-auto animate-spin size-5 text-[#39089D]" />
          ) : (
            "Proceed"
          )}
        </button>
      </form>


      {/* Login Link */}
      {/* <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#39089D] text-[13px]!  font-normal! dark:text-[#289DE5]"
          >
            Sign up
          </Link>
        </p>
      </div> */}
    </div>
  );
};

export default UserDetails;
