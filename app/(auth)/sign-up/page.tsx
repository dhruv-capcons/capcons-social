"use client";

import React, { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";
import { validatePassword } from "@/lib/validations";

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
    countryCode: "91",
    confirmPassword: "",
  });

  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneInput, setIsPhoneInput] = useState(false);

  const [isPasswordMismatch, setPasswordMismatch] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState<null | boolean>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  

  const [errors, setErrors] = useState<string[]>([]);

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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if terms are accepted
    if (!termsAccepted) {
      setErrors(["You must accept the Terms & Conditions to continue"]);
      return;
    } else {
      setErrors([]);
    }

    const { errors: passwordErrors, isValid } = validatePassword(
      formData.password
    );

    if (!isValid) {
      setPasswordValid(false);
      setErrors(passwordErrors);
      return;
    } else {
      setPasswordValid(true);
    }

    setErrors([]);

    const newPassword = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    const registerData = new FormData();

    registerData.append("credential", formData.emailOrPhone.trim());
    registerData.append("password", formData.password?.trim());
    registerData.append("name", formData.fullName?.trim());
    if(isPhoneInput) registerData.append("country_code", formData.countryCode.trim());
    registerData.append("circle_id", "674e9cf6477a49f180248d72");

    register(registerData, {
      onSuccess: (data) => {
        router.push(
          `/verify?identifier=${formData.emailOrPhone}&request_id=${data.request_id}&user_id=${data.user_id}`
        );
      },
      onError: (error) => {
        setErrors([
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        ]);
        console.error("Register Error:", error);
      },
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-1.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium dark:text-[#FFFFFF] `}
        >
          Welcome!<span className="inline-block animate-wave">👋</span> Get Started With Capcons
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal dark:text-[#6C7278]`}>
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
            className="w-full px-4 py-4 text-xs! backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] outline-0 rounded-xl placeholder-[#5A5A5A] transition-all duration-200"
          />
        </div>

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
              className="w-full px-4 py-4 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333]  rounded-xl  placeholder-[#5A5A5A] transition-all duration-200"
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
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200
               ${
                 isPasswordMismatch || isPasswordValid === false
                   ? "border-[#EE5833] dark:border-[#F7594E]"
                   : "border-[#D9D9D9]"
               }
              `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a5a4a4]  hover:text-[#b1b1b1] transition-colors cursor-pointer"
          >
            {showPassword ? (
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
            placeholder="Confirm Password"
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333]  rounded-xl  placeholder-[#5A5A5A] transition-all duration-200
               ${isPasswordMismatch ? "border-[#EE5833] dark:border-[#F7594E]" : "border-[#D9D9D9]"}
              `}
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
        {isPasswordMismatch || errors.length > 0  && <p
          className={`text-[#EE5833] dark:text-[#F7594E] font-medium! ${
            inter.variable
          } text-[10px]! -mt-2 ml-1`}
        >
          {errors.length > 0 ? <>{errors[0]}</> : "Passwords do not match"}
        </p>}

        {/* Terms and Conditions Checkbox */}
        <div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms&privacy"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked) setErrors([]);
              }}
              className={`size-2.5 cursor-pointer accent-[#34AAFF]`}
            />
            <label htmlFor="terms&privacy"
              className={`${inter.variable} text-[10px]! font-light! leading-3! dark:text-[#6C7278]`}
            >
            I agree to the{" "}
            <Link
              href="https://capcons.com/terms"
              target="_blank"
              className="underline text-blue-700 dark:text-[#289DE5]"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="https://capcons.com/privacy"
              target="_blank"
              className="underline text-blue-700 dark:text-[#289DE5]"
            >
              Privacy Policy
            </Link>{" "}
          </label>
          </div>
        
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full mt-6 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer`}
        >
          {isPending ? (
            <LoaderCircle className="mx-auto animate-spin size-5 text-[#39089D]" />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#39089D] dark:text-[#289DE5] text-[13px]!  font-normal!"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
