"use client";

import React, { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/validations";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuth";

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

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [isPasswordValid, setPasswordValid] = useState<null | boolean>(null);

  const [errors, setErrors] = useState<string[]>([]);

  const params = useSearchParams();
  const emailOrPhone = params?.get("identifier") || "";

  const resetPassword = useResetPassword();
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

    // Check password mismatch when both fields have values
    const newPassword = formData.newPassword;
    const confirmPassword = formData.confirmPassword;

    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    const resetData = new FormData();
    resetData.append("credential", emailOrPhone);
    resetData.append("new_password", formData.newPassword);

    resetPassword.mutate(resetData, {
      onSuccess: (data) => {
        console.log("Reset Password Success:", data);
      },
      onError: (error) => {
        setErrors([String(error?.response?.data?.message) || "An error occurred"]);
        console.error("Reset Password Error:", error);
      },
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
        <p className={`${inter.variable} font-inter text-[11px]! font-normal`}>
          Please type something you’ll remember
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
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border rounded-xl placeholder-[#5A5A5A] transition-all duration-200 ${
              passwordMismatch || isPasswordValid === false
                ? "border-[#EE5833]"
                : "border-[#D9D9D9]"
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

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border rounded-xl placeholder-[#5A5A5A] transition-all duration-200 ${
              passwordMismatch ? "border-[#EE5833]" : "border-[#D9D9D9]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a5a4a4]  hover:text-[#b1b1b1] transition-colors cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-3.5 md:size-4 lg:size-5" />
            ) : (
              <Eye className="size-3.5 md:size-4 lg:size-5" />
            )}
          </button>
        </div>

        {/* Password Mismatch & Error */}
        <p
          className={`text-[#EE5833] font-medium! ${
            inter.variable
          } text-[10px]! -mt-2 ml-1 ${
            passwordMismatch || errors.length > 0 ? "" : "invisible"
          }`}
        >
          {errors.length > 0 ? <>{errors[0]}</> : "Passwords do not match"}
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full mt-6 ${inter.variable} bg-[#39089D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer`}
        >
          Confirm Password
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#39089D] text-[13px]!  font-normal!"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
