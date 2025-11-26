"use client";

import { Inter, Public_Sans } from "next/font/google";
import { useState } from "react";
import CardBgSelection from "@/components/onboarding/CardBgSelection";
import InterestSelection from "@/components/onboarding/InterestSelection";
import ProfilePhotoUpload from "@/components/onboarding/ProfilePhotoUpload";
import { useUpdateProfilePic } from "@/hooks/useOnboard";
import { useUpdateInterests } from "@/hooks/useOnboard";
import { useUpdateColorCard } from "@/hooks/useOnboard";
import { MoveLeft } from "lucide-react";

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
  const [done, setDone] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const handleContinue = () => {
    if (step.number < 3) {
      setStep((prev) => ({ ...prev, number: prev.number + 1 }));
    }
  };

  const { mutate: updateProfilePic, isPending: isUploading } =
    useUpdateProfilePic();
  const handlePfpSave = () => {
    if (profileImage) {
      const file = dataURLtoFile(profileImage, "profile.jpg");
      updateProfilePic(
        { profile_image: file },
        {
          onSuccess: () => {
            handleContinue();
          },
        }
      );
    } else {
      handleContinue();
    }
  };

  const { mutate: updateInterests } = useUpdateInterests();
  const handleInterestSave = () => {
    if (selectedInterests.length >= 5) {
      updateInterests(
        { interests: selectedInterests },
        {
          onSuccess: () => {
            handleContinue();
          },
        }
      );
    }
  };

  const { mutate: updateColorCard } = useUpdateColorCard();
  const handleColorCardSave = () => {
    if (selectedColorId) {
      updateColorCard(
        { color_card: selectedColorId },
        {
          onSuccess: () => {
            setDone(true);
          },
        }
      );
    }
  };

  const handleSectionSubmit = () => {
    if (step.number === 1) {
      handlePfpSave();
    }
    if (step.number === 2) {
      handleInterestSave();
    }
    if (step.number === 3) {
      handleColorCardSave();
    }
  };

  if (done) {
    return (
      <div className="w-full h-svh flex items-center justify-center">
        <h1 className={`${publicSans.variable} font-medium! text-[2.8rem]!`}>
          Onboarding Complete!
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-svh h-full bg-[#FBF9FF] ${
        isModalOpen ? "dark:bg-[#47464670]" : "dark:bg-[#101010]"
      } relative `}
    >
      {step.number > 1 && (
        <button
          onClick={() => {
            setStep((prev) => ({ ...prev, number: prev.number - 1 }));
          }}
          className="absolute top-4 xmd:top-10 left-10 border-0 outline-0 bg-transparent cursor-pointer dark:text-white z-100 flex items-center justify-between"
        >
          <MoveLeft size={24} /> <span className="ml-2">Back</span>
        </button>
      )}
      <section
        data-step={step.number}
        className="w-full xmd:max-w-7/12 h-svh mx-auto flex flex-col p-6 xmd:shadow-2xl dark:shadow-gray-700 relative py-3 overflow-hidden"
      >
        <div className="sticky top-0 z-50 pt-6 xmd:pt-1">
          <div className="duration-200  py-2 pt-4 ">
            <div className="h-[9px] w-full rounded-full bg-[#EDF1F3] dark:bg-[#1C1C1C]">
              <div
                style={{
                  width: `${(step.number / 3) * 100}%`,
                }}
                className="h-[9px] rounded-full bg-[#39089D] dark:bg-[#6234BF] duration-300"
              ></div>
            </div>
          </div>

          <div className="w-full flex justify-between items-start pt-4 xmd:pt-7 pb-2">
            <div>
              <h1
                className={`${publicSans.variable} font-medium! text-[2.2rem]!`}
              >
                {step.number === 1 && "Add Profile Photo"}
                {step.number === 2 && "Dive into your Passion"}
                {step.number === 3 && "Bring your Crew"}
              </h1>
              <p
                className={`${inter.variable} text-[#8B8C8F] pt-2 font-normal! text-[1.2rem]!`}
              >
                {step.number === 1 && "Upload your profile picture"}
                {step.number === 2 &&
                  "Choose minimum 5 interest areas of yours"}
                {step.number === 3 && "Let’s Connect"}
              </p>
            </div>

            {step.isSkipable && (
              <div>
                <button
                  onClick={() => {
                    if (step.number === 3) {
                      setDone(true);
                      return;
                    }
                    handleContinue();
                  }}
                  className={`${inter.variable} text-[1.2rem] font-normal text-[#39089D] dark:text-[#743FE3]  bg-transparent border-0 outline-0 cursor-pointer`}
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative overflow-y-auto overflow-x-hidden py-10">
          {step.number === 1 && (
            <ProfilePhotoUpload
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}

          {step.number === 2 && (
            <InterestSelection
              onInterestsChange={(interests) => {
                setSelectedInterests(interests);
              }}
            />
          )}

          {step.number === 3 && (
            <CardBgSelection
              onColorChange={(colorId) => {
                setSelectedColorId(colorId);
              }}
            />
          )}
        </div>

        <div
          data-step={step.number}
          className="flex items-center justify-center sticky bottom-0 py-2"
        >
          <button
            onClick={handleSectionSubmit}
            className={`${inter.variable} font-medium text-base bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white  py-3.5 w-82 rounded-3xl mx-auto! cursor-pointer`}
          >
            {step.number === 1
              ? isUploading
                ? "Saving..."
                : "Save"
              : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default OnBoarding;
