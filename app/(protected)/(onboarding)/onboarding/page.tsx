"use client";

import { Inter, Public_Sans } from "next/font/google";
import { useState } from "react";
import CardBgSelection from "@/components/onboarding/CardBgSelection";
import InterestSelection from "@/components/onboarding/InterestSelection";
import ProfilePhotoUpload from "@/components/onboarding/ProfilePhotoUpload";
import { useUpdateProfilePic } from "@/hooks/useOnboard";

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

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const OnBoarding = () => {
  const [step, setStep] = useState({
    number: 1,
    isSkipable: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { mutate: updateProfilePic, isPending: isUploading } =
    useUpdateProfilePic();

  const handleContinue = () => {
    if (step.number < 3) {
      setStep((prev) => ({ ...prev, number: prev.number + 1 }));
    }
  };

  const handlePfpSave = () => {
    if (profileImage) {
      const file = dataURLtoFile(profileImage, "profile.jpg");
      updateProfilePic(
        { profile_image: file },
        {
          onSuccess: () => {
            handleContinue();
          },
          onError: () => {
            handleContinue();
          }
        }
      );
    } else {
      handleContinue();
    }
  };

  return (
    <div
      className={`w-full h-svh bg-[#FBF9FF] ${
        isModalOpen ? "dark:bg-[#47464670]" : "dark:bg-[#101010]"
      } relative`}
    >
      <section className="max-w-9/12 mx-auto py-10 space-y-12">
        <div>
          <div className="h-[9px] w-full rounded-full bg-[#EDF1F3] dark:bg-[#1C1C1C]">
            <div
              style={{
                width: `${(step.number / 3) * 100}%`,
              }}
              className="h-[9px] rounded-full bg-[#39089D] dark:bg-[#6234BF] duration-300"
            ></div>
          </div>
        </div>

        <div className="w-full flex justify-between items-start">
          <div>
            <h1
              className={`${publicSans.variable} font-medium! text-[2.8rem]!`}
            >
              {step.number === 1 && "Dive into your Passion"}
              {step.number === 2 && "Add Profile Photo"}
              {step.number === 3 && "Bring your Crew"}
            </h1>
            <p
              className={`${inter.variable} text-[#8B8C8F] font-normal! text-[1.6rem]!`}
            >
              {step.number === 1 && "Choose minimum 5 interest areas of yours"}
              {step.number === 2 && "Upload your profile picture"}
              {step.number === 3 && "Let’s Connect"}
            </p>

            {step.number === 1 && (
              <p
                className={`${inter.variable} font-medium! text-[#794FD1]  text-[1.6rem]! mt-9`}
              >
                10 Selected
              </p>
            )}
          </div>

          {step.isSkipable && (
            <div>
              <button
                className={`${inter.variable} text-[1.6rem] font-normal text-[#39089D] dark:text-[#743FE3]  bg-transparent border-0 outline-0 cursor-pointer`}
              >
                Skip
              </button>
            </div>
          )}
        </div>

        <div>
          {step.number === 1 && <InterestSelection />}

          {step.number === 2 && (
            <ProfilePhotoUpload
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}

          {step.number === 3 && <CardBgSelection />}
        </div>

        <div className="flex items-center justify-center mt-16">
          {step.number === 2 ? (
            <button
              onClick={handlePfpSave}
              disabled={isUploading}
              className={`${inter.variable} font-medium text-base bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white  py-3.5 w-82 rounded-3xl mx-auto! cursor-pointer`}
            >
              {isUploading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`${inter.variable} font-medium text-base bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white  py-3.5 w-82 rounded-3xl mx-auto! cursor-pointer`}
            >
              Continue
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default OnBoarding;
