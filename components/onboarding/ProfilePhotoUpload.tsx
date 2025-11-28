import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import ImageZoomModal from "@/components/onboarding/ImageZoomModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

interface ProfilePhotoUploadProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
}

const ProfilePhotoUpload = ({
  isModalOpen,
  setIsModalOpen,
  profileImage,
  setProfileImage,
}: ProfilePhotoUploadProps) => {
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setTempImage(imageUrl);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCroppedImage = (croppedImage: string) => {
    setProfileImage(croppedImage);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <label
          htmlFor="profile-upload"
          className="w-38 h-38 md:w-52 md:h-52 my-40 mx-auto rounded-full flex justify-center items-center cursor-pointer"
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={209}
              height={209}
              draggable={false}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="relative">
              <Image
                src="/icons/eclipse.svg"
                alt="Profile"
                width={209}
                height={209}
                draggable={false}
                className="w-full h-full object-cover rounded-full dark:hidden"
              />
              <Image
                src="/icons/darkeclipse.svg"
                alt="Profile"
                width={209}
                height={209}
                draggable={false}
                className="w-full h-full object-cover rounded-full hidden dark:block"
              />
              <p
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${inter.variable} text-4xl! md:text-6xl! text-[#E1E3E5] dark:text-[#8B8C8F] font-normal!`}
              >
                DR
              </p>
            </div>
          )}
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <ImageZoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={tempImage || ""}
        onSave={handleSaveCroppedImage}
      />
    </>
  );
};

export default ProfilePhotoUpload;
