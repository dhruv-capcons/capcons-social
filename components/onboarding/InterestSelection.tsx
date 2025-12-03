import { Public_Sans, Mulish, Inter } from "next/font/google";
import { Plus } from "lucide-react";
import { cx } from "class-variance-authority";
import { Interest, useGetInterests } from "@/hooks/useOnboard";
import { useState } from "react";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

const InterestSelection = ({
  onInterestsChange,
}: {
  onInterestsChange?: (interests: string[]) => void;
}) => {


  const { data, isLoading } = useGetInterests({
    page: 1,
    length: 15
  });

  const interestByCategory = data?.interestByCategory;
  const interestCategories = data?.interestCategories || [];

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestSlug: string) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interestSlug)
        ? prev.filter((slug) => slug !== interestSlug)
        : [...prev, interestSlug];
      

      onInterestsChange?.(updated);
      return updated;
    });
  };

  const isSelected = (interestSlug: string) =>
    selectedInterests.includes(interestSlug);

  if (isLoading)
    return (
      <div >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#E7E7FF] dark:bg-[#3a3a3a]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3] rounded-full animate-pulse" />
          <div
            className={`${publicSans.variable} font-normal! w-64 h-10 rounded-full bg-[#E7E7FF] dark:bg-[#3a3a3a] animate-pulse`}
          />
        </div>
      </div>
    );

  console.log(selectedInterests);

  return (
    <>
      <p
        className={`${inter.variable} bg-[#FBF9FF] dark:bg-[#101010] font-medium! text-[#794FD1] text-base sm:text-lg md:text-[1.6rem]! mb-5 sm:mb-10 md:mb-18 sticky -top-2 sm:-top-5 md:-top-10 transition-all duration-300`}
      >
        {selectedInterests.length} Selected
      </p>
    <div className="space-y-8 sm:space-y-12 md:space-y-18">
      {interestCategories.map((category : Interest) => (
        <div key={category.slug}>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 bg-[#E7E7FF] dark:bg-[#3a3a3a] rounded-full flex items-center justify-center">
              <span className="text-[#39089D] dark:text-[#743FE3] text-xl">
                {category.name.charAt(0)}
              </span>
            </div>
            <h1
              className={`${publicSans.variable} font-medium!  text-base! sm:text-2xl! md:text-[2.2rem]! md:font-normal!`}
            >
              {category.name}
            </h1>
          </div>
          <ul className="mt-4 sm:mt-8 flex flex-wrap gap-4">
            {interestByCategory &&
              interestByCategory[category.slug]?.length > 0 &&
              interestByCategory[category.slug]
                .slice(0, category.slug === "fashion" ? 10 : undefined)
                .map((interest : Interest) => (
                  <li
                    key={interest._id}
                    onClick={() => toggleInterest(interest.slug)}
                    className={cx(
                      `flex w-fit items-center gap-2 px-3 py-3 rounded-full text-xs! sm:text-base! sm:px-5 md:text-lg! cursor-pointer duration-300 hover:-translate-0.5 ${mulish.variable}`,
                      isSelected(interest.slug)
                        ? `bg-[#E7E7FF] dark:bg-[#191919]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3]`
                        : ` bg-white dark:bg-[#0D0D0D] text-[#1A1C1E] dark:text-white  border border-[#E5E5E5] dark:border-[#272727]`
                    )}
                  >
                    {interest.name}
                    <Plus
                      className={`duration-200 size-4 sm:size-5 md:size-6 ${
                        isSelected(interest.slug) && "rotate-45"
                      }`}
                    />{" "}
                  </li>
                ))}
          </ul>
        </div>
      ))}
    </div>
    </>
  );
};

export default InterestSelection;
