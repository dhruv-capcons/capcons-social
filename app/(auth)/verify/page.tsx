"use client";

import { useState } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { useParams } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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

const Verify = () => {

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);

  const params = useParams();
  const emailOrPhone = params?.identifier || "";
  const isPhoneInput = emailOrPhone.includes("@") ? false : true;

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    setOtpError(false);

    // Simulate wrong code validation
    if (value !== "123456") {
      setOtpError(true);
    } else {
      setOtpError(false);
      // Handle successful verification
      console.log("OTP verified successfully!");
    }
  };


  return (
    <div className="w-full">
      <div className="space-y-3.5 mb-8">
        <p className={`${inter.variable} text-[26px]! leading-8! font-medium  `}>
         Please verify your {
                isPhoneInput ? "Phone Number" : "Email address"
        }

        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal`}>
          We’ve sent an email to {emailOrPhone}, please enter the code below.
         
        </p>
      </div>

      {/* verify otp */}
        <form className="space-y-6">
          {/* OTP Input */}
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setOtpError(false);
                if (value.length === 6) {
                  handleOtpComplete(value);
                }
              }}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={`w-11 h-10 text-lg font-medium rounded-sm border-2 transition-all duration-200 ${
                      otpError
                        ? "border-red-500! "
                        : "border-[#D9D9D9] bg-white hover:border-gray-400 focus:border-[#39089D]"
                    }`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Error Message */}
            <p
              className={`text-[#F54135] text-xs! font-normal -mt-2 ${
                !otpError && "invisible"
              }`}
            >
              Wrong code, please try again
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-0 ${
              inter.variable
            } bg-[#39089D] hover:bg-[#2a0674] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-sm disabled:opacity-50 cursor-pointer`}
            disabled={otp.length !== 6}
          >
            Verify
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

export default Verify;
