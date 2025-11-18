"use client";

import React, { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { validatePassword } from "@/lib/validations";
import { useLogin } from "@/hooks/useAuth";
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

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    countryCode: "91",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneInput, setIsPhoneInput] = useState(false);

  const [isPasswordValid, setPasswordValid] = useState<null | boolean>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate: login, isPending } = useLogin();
  const router = useRouter();

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

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

    const loginData = new FormData();

    loginData.append("credential", formData.emailOrPhone);
    loginData.append("password", formData.password);
    if (isPhoneInput) {
      loginData.append("country_code", formData.countryCode);
    }
    if (rememberMe) {
      loginData.append("remember_user", "yes");
    }

    login(loginData, {
      onSuccess: (data) => {
        router.push("/dashboard");
        console.log("Login Success:", data);
      },
      onError: (error) => {
        setErrors([
          error?.response?.data.message || "Login failed. Please try again.",
        ]);
        console.error("Login Error:", error);
      },
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-1.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium  `}
        >
          Welcome Back!👋
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal`}>
          Login with your account
        </p>
      </div>

      {/* sign up form */}

      <form onSubmit={handleLogin} className="space-y-3">
        {/* Email or Phone Field with Netflix-style switching */}
        <div className="relative">
          {isPhoneInput ? (
            <div className="flex space-x-2">
              <div className="relative flex items-center backdrop-blur-sm border border-[#D9D9D9] rounded-xl min-w-20">
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
            className={`w-full px-4 py-4 pr-12 text-xs! outline-0 backdrop-blur-sm border border-[#D9D9D9] rounded-xl  placeholder-[#5A5A5A] transition-all duration-200 
              ${
                isPasswordValid === false
                  ? "border-[#EE5833]"
                  : "border-[#D9D9D9]"
              }`}
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

        {errors.length > 0 && (
          <p
            className={`text-[#EE5833] font-medium! ${inter.variable} text-[10px]! -mt-2 ml-1 `}
          >
            {errors[0]}
          </p>
        )}

        {/* remember Me Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            className="size-2.5"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <p
            className={`${inter.variable} text-[10px]! font-light! leading-3!`}
          >
            Remember me?
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full mt-6.5 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-xs! cursor-pointer`}
        >
          {isPending ? (
            <LoaderCircle className="mx-auto animate-spin size-5 text-[#39089D]" />
          ) : (
            "Login"
          )}
        </button>
      </form>

      <Link
        href="/forgot-password"
        className={`mt-4 ${inter.variable} block text-center text-[10px]! text-[#312ECB] font-normal!`}
      >
        Forgot Password?
      </Link>

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

export default Login;
