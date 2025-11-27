"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";
import {useOnboardingGeneral} from "@/hooks/useOnboard";
import { useOnboardStore } from "@/store/onboardStore";
import { useUserStore } from "@/store/userStore";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


const UserDetails = () => {

  const router = useRouter();
  const { userData ,setUserData } = useUserStore();
  
  if( !userData?.user_name || !userData?.dob  || !userData?.description ) {
    router.back();

  }

  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    description: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    description?: string;
    general?: string;
  }>({});

  const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    // Only alphanumeric and underscore allowed
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const validateDescription = (description: string): string | null => {
    if (!description) return null; // Description is optional
    const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 50) {
      return "Description must be 50 words or less";
    }
    return null;
  };

  const getWordCount = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear specific field error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    // For username, remove spaces and special characters as they type
    if (name === "username") {
      const sanitized = value.replace(/[^a-zA-Z0-9_]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
      return;
    }

    // For description, prevent exceeding 50 words
    if (name === "description") {
      const wordCount = getWordCount(value);
      if (wordCount > 50) {
        return; // Don't update if exceeds 50 words
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const { mutate: updateUserProfile, isPending } = useOnboardingGeneral();
  const { setOnboardingStep } = useOnboardStore();
  
  
  const handleUserDetails = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameError = validateUsername(formData.username);
    const descriptionError = validateDescription(formData.description);
    
    if (usernameError || descriptionError) {
      setErrors({
        username: usernameError || undefined,
        description: descriptionError || undefined,
      });
      return;
    }
  
    updateUserProfile(formData, {
      onSuccess: (data) => {
        setUserData({
          dob: formData.dob,
          description: formData.description,
          name: data.data.name,
          user_name: formData.username,
          pfp_url: data.data.pfp_url,
          color_card_id: data.data.color_card_id,
          interests: data.data.interests,
          email: data.data.email,
          phone: data.data.phone,
          onboarding_step: 3, // Move to next step
        });
        // Get user data from cookie
        const userDataCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_data='));
        
        if (userDataCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
            const onboardingStep = userData.onboarding_step || 1;

            if(onboardingStep > 4) {
              router.push("/welcome");
              return;
            }
            
            setOnboardingStep(onboardingStep);
            router.push("/onboarding");
          } catch (error) {
            console.error("Error parsing user data:", error);
            router.push("/onboarding");
          }
        } else {
          router.push("/onboarding");
        }
      },
      onError: (error) => {
        setErrors({ general: error.message });
      },
    });
  };


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
            className={`w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border ${
              errors.username
                ? "border-[#EE5833] dark:border-[#EE5833]"
                : "border-[#D9D9D9] dark:border-[#333333]"
            } rounded-xl placeholder-[#5A5A5A] transition-all duration-200`}
          />
          {errors.username && (
            <p
              className={`text-[#EE5833] font-medium! ${inter.variable} text-[10px]! mt-1 ml-1`}
            >
              {errors.username}
            </p>
          )}
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
            placeholder="Eg. Hello! I am a life enthusiast, a tech enthusiast and a content creator."
            className={`w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border ${
              errors.description
                ? "border-[#EE5833] dark:border-[#EE5833]"
                : "border-[#D9D9D9] dark:border-[#333333]"
            } rounded-xl placeholder-[#5A5A5A] transition-all duration-200 resize-none`}
          />
          {errors.description && (
            <p
              className={`text-[#EE5833] font-medium! ${inter.variable} text-[10px]! mt-1 ml-1`}
            >
              {errors.description}
            </p>
          )}
        </div>

        {/* Word count */}
        <div className="flex items-center justify-between gap-2 -mt-2">
          <p
            className={`${inter.variable} text-[11px]! font-light! leading-3! text-[#1A91DA]`}
          >
            Max 50 words
          </p>
          <p
            className={`${inter.variable} text-[11px]! font-light! leading-3! ${
              getWordCount(formData.description) > 45
                ? "text-[#EE5833]"
                : "text-[#8B8C8F]"
            }`}
          >
            {getWordCount(formData.description)}/50 words
          </p>
        </div>

        {errors.general && (
          <p
            className={`text-[#EE5833] font-medium! ${inter.variable} text-[10px]! -mt-2 ml-1 `}
          >
            {errors.general}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || !formData.username.trim() || !formData.dob.trim()}
          className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#9E9E9E] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer disabled:cursor-not-allowed`}
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
