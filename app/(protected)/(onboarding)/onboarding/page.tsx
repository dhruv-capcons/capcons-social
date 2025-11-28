"use client";

import { Inter, Public_Sans } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CardBgSelection from "@/components/onboarding/CardBgSelection";
import InterestSelection from "@/components/onboarding/InterestSelection";
import ProfilePhotoUpload from "@/components/onboarding/ProfilePhotoUpload";
import { useUpdateProfilePic } from "@/hooks/useOnboard";
import { useUpdateInterests } from "@/hooks/useOnboard";
import { useUpdateColorCard } from "@/hooks/useOnboard";
import { useOnboardStore } from "@/store/onboardStore";
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
  const { onboardingStep, setOnboardingStep } = useOnboardStore();
  const router = useRouter();
  
  // API steps: 1=username, 2=pfp, 3=interests, 4=color_card, >4=complete
  // UI steps: 1=pfp, 2=interests, 3=color_card
  // So we need to subtract 1 from API step to get UI step
  const calculateUIStep = (apiStep: number) => {
    if (apiStep > 4) return 4; // Onboarding complete, will redirect
    if (apiStep <= 1) return 1; // Not started or just username
    return apiStep - 1; // Convert API step to UI step
  };
  
  const initialStep = calculateUIStep(onboardingStep || 1);
  
  const [step, setStep] = useState({
    number: initialStep,
    isSkipable: true,
  });



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>("1");

  const handleContinue = () => {
    if (step.number < 3) {
      setStep((prev) => ({ ...prev, number: prev.number + 1 }));
      // Update store: UI step + 1 to convert back to API step
      const nextApiStep = step.number + 2; // +1 for next step, +1 for offset
      setOnboardingStep(nextApiStep);
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
            // Onboarding complete, set step > 4
            setOnboardingStep(5);
            router.push("/welcome");
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
            // Update store: UI step + 1 to convert back to API step
            const prevApiStep = (step.number - 1) + 1; // -1 for prev step, +1 for offset
            setOnboardingStep(prevApiStep);
          }}
          className="absolute top-2 xmd:top-10 left-6 xmd:left-10 border-0 outline-0 bg-transparent cursor-pointer dark:text-white z-100 flex items-center justify-between"
        >
          <MoveLeft size={24} /> <span className="ml-2">Back</span>
        </button>
      )}
      <section
        data-step={step.number}
        className="w-full xmd:max-w-7/12 h-svh mx-auto flex flex-col p-6 xmd:shadow-lg dark:shadow-gray-700 relative py-3 overflow-hidden"
      >
        <div className="sticky top-0 z-50 pt-6 xmd:pt-1">
          <div className="duration-200  py-2 pt-0 sm:pt-4 ">
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
                className={`${publicSans.variable} font-medium! text-xl! sm:text-3xl! md:text-[2.2rem]!`}
              >
                {step.number === 1 && "Add Profile Photo"}
                {step.number === 2 && "Dive into your Passion"}
                {step.number === 3 && "Bring your Crew"}
              </h1>
              <p
                className={`${inter.variable} text-[#8B8C8F] pt-2 font-normal! text-base! sm:text-lg! md:text-[1.2rem]!`}
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
                      // Skip final step, mark as complete
                      setOnboardingStep(5);
                      router.push("/welcome");
                      return;
                    }
                    handleContinue();
                  }}
                  className={`${inter.variable} text-sm md:text-base font-normal text-[#39089D] dark:text-[#743FE3]  bg-transparent border-0 outline-0 cursor-pointer`}
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </div>

        <div data-step={step.number} className={`flex-1 relative overflow-y-hidden data-[step='2']:overflow-y-auto data-[step='3']:overflow-y-auto overflow-x-hidden py-2 sm:py-5 md:py-10 data-[step='3']:py-2 data-[step='3']:flex data-[step='3']:items-center data-[step='1']:flex data-[step='1']:items-center  max-h-[calc(svh-100px)]`}>
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
          className="flex items-center justify-center sticky bottom-0 py-2 xmd:data-[step='1']:pb-20"
        >
          <button
            onClick={handleSectionSubmit}
            disabled={
              (step.number === 1 && (!profileImage)) ||
              (step.number === 2 && selectedInterests.length < 5) ||
              (step.number === 3 && !selectedColorId)
            }
            className={`${inter.variable} font-medium text-base bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] disabled:text-[#C1C1C2] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] dark:disabled:bg-[#1C1C1C] dark:disabled:text-[#5A5A5A] shadow-xs shadow-[#0A0D120D]  text-white  py-3.5 w-82 rounded-3xl mx-auto! cursor-pointer disabled:cursor-not-allowed`}
          >
            {step.number === 1
              ? isUploading
                ? "Saving..."
                : "Add a Photo"
              : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default OnBoarding;
