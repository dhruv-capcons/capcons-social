"use client";

import { useState, useEffect, Suspense } from "react";
import { Inter, Public_Sans } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { useCountdownTimer } from "@/lib/timer";
import { useRouter } from "next/navigation";
import { useVerify } from "@/hooks/useAuth";
import { useResendOTP } from "@/hooks/useAuth";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

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

const VerifyOTPContent = () => {
  // OTP states
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpIncomplete, setOtpIncomplete] = useState<boolean | null>(null);

  const { formattedTime, isZero, startCountdown, restartCountdown } =
    useCountdownTimer();

  useEffect(() => {
    startCountdown();
  }, []);

  const verify = useVerify();
  const router = useRouter();

  const params = useSearchParams();
  const emailOrPhone = params?.get("identifier") || "";
  const requestId = params?.get("request_id") || "";
  const isPhoneInput = emailOrPhone.includes("@") ? false : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setOtpIncomplete(true);
      return;
    } else {
      setOtpIncomplete(false);
    }

    const verificationData = new FormData();
    verificationData.append("credential", emailOrPhone);
    verificationData.append("code", otp);
    verificationData.append("method", isPhoneInput ? "phone" : "email");
    verificationData.append("password_reset", "yes");
    verificationData.append("request_id", requestId);

    verify.mutate(verificationData, {
      onSuccess: (data) => {
        router.push(`/forgot-password/reset?identifier=${emailOrPhone}`);
        console.log("Verify OTP Success:", data);
      },
      onError: (error) => {
        setOtpError(true);
        console.error("Verify OTP Error:", error);
      },
    });

  };

  const resendOtp = useResendOTP();

  const handleResendCode = () => {

    const resendData = new FormData();
    resendData.append("request_id", requestId);
    resendData.append("circle_id", "default_circle");

    resendOtp.mutate(resendData, {
      onSuccess: (data) => {
        restartCountdown();
        console.log("Resend OTP Success:", data);
      },
      onError: (error) => {
        console.error("Resend OTP Error:", error);
      },
    });

  };

  return (
    <div className="w-full">
      <div className="space-y-3.5 mb-8">
        <p
          className={`${inter.variable} text-[26px]! leading-8! font-medium  `}
        >
          Please verify OTP
        </p>
        <p className={`${inter.variable} font-inter text-[11px]! font-normal`}>
          We’ve sent an email to{" "}
          <span className="font-semibold!">{emailOrPhone}</span>, please enter
          the code below.
        </p>
      </div>

      {/* verify otp */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setOtpError(false);
              if (value.length === 6) {
                setOtpIncomplete(false);
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

          {otpIncomplete && (
            <p className={`text-[#F54135] text-xs! font-normal -mt-2`}>
              Enter complete 6-digit code
            </p>
          )}

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
          className={`w-full mt-0 ${inter.variable} bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] text-white font-medium py-3 px-6 rounded-3xl transition-all duration-200 transform outline-0 text-sm disabled:opacity-50 cursor-pointer`}
        >
          Verify
        </button>
      </form>

      {/* Resend OTP Link */}
      <p
        className={`text-[11px]! ${inter.variable}  font-medium text-center mt-2 cursor-pointer `}
      >
        {isZero ? (
          <>
            <button
              onClick={handleResendCode}
              className="hover:underline cursor-pointer"
            >
              Resend code
            </button>
          </>
        ) : (
          <>
            Send code again{" "}
            <span className="text-[#F52020B2]">{formattedTime}</span>{" "}
          </>
        )}
      </p>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className={`${publicSans.variable} text-[13px]! font-light!`}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#39089D] text-[13px]!  font-normal!"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

const VerifyOTP = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
};

export default VerifyOTP;
