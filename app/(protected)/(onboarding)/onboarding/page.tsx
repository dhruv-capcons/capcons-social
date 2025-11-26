"use client";

import { Inter, Public_Sans } from "next/font/google";
import { useState } from "react";
import CardBgSelection from "@/components/onboarding/CardBgSelection";
import InterestSelection from "@/components/onboarding/InterestSelection";
import ProfilePhotoUpload from "@/components/onboarding/ProfilePhotoUpload";
import { useUpdateProfilePic } from "@/hooks/useOnboard";
import { useUpdateInterests } from "@/hooks/useOnboard";
import { useUpdateColorCard } from "@/hooks/useOnboard";

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
  
  const { mutate: updateProfilePic, isPending: isUploading } =   useUpdateProfilePic();
  const handlePfpSave = () => {
    if (profileImage) {
      const file = dataURLtoFile(profileImage, "profile.jpg");
      updateProfilePic(
        { profile_image: file },
        {
          onSuccess: () => {
            handleContinue();
          }
        }
      );
    } else {
      handleContinue();
    }
  };

  const { mutate: updateInterests } = useUpdateInterests();
  const handleInterestSave = () => {
   if(selectedInterests.length >= 5){
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
    if(selectedColorId) {
      updateColorCard(
        { color_card : selectedColorId },
        {
          onSuccess: () => {
            setDone(true);
          },
        }
      );
    }
  };

  const handleSectionSubmit = () => {
    if(step.number === 1){
      handleInterestSave();
    }
    if(step.number === 2){
      handlePfpSave();
    }
    if(step.number === 3){
      handleColorCardSave();
    }

  }



  if(done){
    return (<div className="w-full h-svh flex items-center justify-center">
      <h1
        className={`${publicSans.variable} font-medium! text-[2.8rem]!`}
      >
        Onboarding Complete!
      </h1>
    </div>
  );
  }

  return (
    <div
      data-step={step.number}
      className={`w-full min-h-svh h-full bg-[#FBF9FF] ${
        isModalOpen ? "dark:bg-[#47464670]" : "dark:bg-[#101010]"
      } relative data-[step="1"]:flex data-[step="1"]:items-center data-[step="1"]:justify-center`}
    >
      {step.number > 1 && <button onClick={() => {
        setStep((prev) => ({ ...prev, number: prev.number - 1 }));
      }} className="absolute top-10 left-10 border-0 outline-0 bg-transparent cursor-pointer dark:text-white ">
        back
      </button>}
      <section 
        data-step={step.number}
        className="max-w-8/12 w-full mx-auto space-y-12 data-[step='1']:xmd:w-8/12 data-[step='1']:xmd:p-6 data-[step='1']:xmd:pb-0 data-[step='1']:xmd:bg-white data-[step='1']:xmd:dark:bg-[#101010] data-[step='1']:xmd:h-[85svh] data-[step='1']:xmd:overflow-y-auto data-[step='1']:xmd:rounded-3xl data-[step='1']:xmd:shadow-2xl data-[step='1']:xmd:dark:shadow-gray-700 data-[step='1']:xmd:relative data-[step='2']:py-8 data-[step='3']:py-8"
      >
        <div className="duration-200 backdrop-blur-lg py-2 sticky top-0 bg-white dark:bg-[#101010] z-10">
          <div className="h-[9px] w-full rounded-full bg-[#EDF1F3] dark:bg-[#1C1C1C]">
            <div
              style={{
                width: `${(step.number / 3) * 100}%`,
              }}
              className="h-[9px] rounded-full bg-[#39089D] dark:bg-[#6234BF] duration-300"
            ></div>
          </div>
        </div>

        <div className="w-full flex justify-between items-start sticky top-5 bg-white dark:bg-[#101010] pt-4 pb-2 z-10">
          <div>
            <h1
              className={`${publicSans.variable} font-medium! text-[2.2rem]!`}
            >
              {step.number === 1 && "Dive into your Passion"}
              {step.number === 2 && "Add Profile Photo"}
              {step.number === 3 && "Bring your Crew"}
            </h1>
            <p
              className={`${inter.variable} text-[#8B8C8F] font-normal! text-[1.2rem]!`}
            >
              {step.number === 1 && "Choose minimum 5 interest areas of yours"}
              {step.number === 2 && "Upload your profile picture"}
              {step.number === 3 && "Let’s Connect"}
            </p>
          </div>

          {step.isSkipable && (
            <div>
              <button
              onClick={() => {
                if(step.number === 3){
                  setDone(true);
                  return;
                }
                handleContinue()}}
                className={`${inter.variable} text-[1.2rem] font-normal text-[#39089D] dark:text-[#743FE3]  bg-transparent border-0 outline-0 cursor-pointer`}
              >
                Skip
              </button>
            </div>
          )}
        </div>

        <div>
          {step.number === 1 && <InterestSelection 
          onInterestsChange={(interests) => {
             setSelectedInterests(interests);
            }} 
          />}

          {step.number === 2 && (
            <ProfilePhotoUpload
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}

          {step.number === 3 && <CardBgSelection
           onColorChange={(colorId) => {
            setSelectedColorId(colorId);
          }} 
          />}
        </div>

        <div 
          data-step={step.number}
          className="flex items-center justify-center mt-16 data-[step='1']:xmd:sticky data-[step='1']:xmd:bottom-0 data-[step='1']:xmd:bg-white data-[step='1']:xmd:dark:bg-[#101010] data-[step='1']:xmd:pt-2 data-[step='1']:xmd:pb-6"
        >
            <button
              onClick={handleSectionSubmit}
              className={`${inter.variable} font-medium text-base bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] disabled:bg-[#F6F6F6] shadow-xs shadow-[#0A0D120D] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] text-white  py-3.5 w-82 rounded-3xl mx-auto! cursor-pointer`}
            >
              {step.number === 2 ? isUploading ? "Saving..." : "Save" : "Continue"}
            </button>
    
        </div>
      </section>

    </div>
  );
};

export default OnBoarding;
