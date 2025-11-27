"use client";

import React, { useState, Suspense } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { validatePassword } from "@/lib/validations";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const ResetPasswordContent = () => {
  const [formData, setFormData] = useState({
    newPassword: ""
  });

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isPasswordValid, setPasswordValid] = useState<null | boolean>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useSearchParams();
  const emailOrPhone = params?.get("identifier") || "";

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { errors: passwordErrors, isValid } = validatePassword(
      formData.newPassword
    );

    if (!isValid) {
      setPasswordValid(false);
      setErrors(passwordErrors);
      return;
    } else {
      setPasswordValid(true);
    }

    setErrors([]);

    setIsSubmitting(true);

    const resetData = new FormData();
    resetData.append("credential", emailOrPhone);
    resetData.append("new_password", formData.newPassword);

    // Call our Next.js API route which will handle the password_reset_token cookie
    fetch('/api/auth/reset-password', {
      method: 'POST',
      body: resetData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Password reset failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reset Password Success:", data);
        router.push("/login");
      })
      .catch((error) => {
        setErrors([error.message || "An error occurred"]);
        console.error("Reset Password Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    // Handle reset password logic here
    console.log("Reset Password Data:", formData);
  };

  return (
    <div className="w-full">
      <div className="space-y-1.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium  `}
        >
          Reset Password
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal dark:text-[#6C7278]`}>
          Please type something you&apos;ll remember
        </p>
      </div>

      {/* reset password form */}
      <form onSubmit={handleResetSubmit} className="space-y-3">
        {/* New Password Field */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter New Password"
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border rounded-xl placeholder-[#5A5A5A] transition-all duration-200 focus:border-[#39089D] ${
            isPasswordValid === false
                ? "border-[#EE5833] dark:border-[#F7594E]"
                : "border-[#D9D9D9] dark:border-[#333333]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a5a4a4]  hover:text-[#b1b1b1] transition-colors cursor-pointer"
          >
            {showNewPassword ? (
              <EyeOff className="size-3.5 md:size-4 lg:size-5" />
            ) : (
              <Eye className="size-3.5 md:size-4 lg:size-5" />
            )}
          </button>
        </div>


        {/* Password Mismatch & Error */}
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
          disabled={isSubmitting || !formData.newPassword.trim()}
         className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#9E9E9E] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <LoaderCircle className="mx-auto animate-spin size-5 text-[#39089D]" />
          ) : (
            " Confirm Password"
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#39089D] dark:text-[#289DE5] text-[13px]!  font-normal!"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
