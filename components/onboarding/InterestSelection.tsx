import { Public_Sans, Mulish, Inter } from "next/font/google";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cx } from "class-variance-authority";
import { useGetInterests } from "@/hooks/useOnboard";
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
  const interestCategories = [
    {
      icon: "/icons/trending.svg",
      title: "Fashion",
      slug: "fashion",
    },
     {
      icon: "/icons/popcorn.svg",
      title: "Travel",
      slug: "travel",
    },
     {
      icon: "/icons/popcorn.svg",
      title: "Movies",
      slug: "movies",
    },
    {
      icon: "/icons/popcorn.svg",
      title: "Technology",
      slug: "technology",
    },
    {
      icon: "/icons/popcorn.svg",
      title: "Music",
      slug: "music",
    },
    {
      icon: "/icons/popcorn.svg",
      title: "Food",
      slug: "food",
    },
    {
      icon: "/icons/popcorn.svg",
      title: "Sports",
      slug: "sports",
    },
    {
      icon: "/icons/trending.svg",
      title: "Education",
      slug: "education",
    },
  ];

  const { data, isLoading } = useGetInterests({
    page: 1,
    length: 15,
    parent_slugs: interestCategories.map((cat) => cat.slug),
  });
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
        className={`${inter.variable} bg-[#FBF9FF] dark:bg-[#101010] font-medium! text-[#794FD1] text-[1.6rem]! mb-18 sticky -top-10 transition-all duration-300`}
      >
        {selectedInterests.length} Selected
      </p>
    <div className="space-y-18">
      {interestCategories.map((category) => (
        <div key={category.slug}>
          <div className="flex items-center gap-4">
            <Image
              src={category.icon}
              alt={category.title}
              width={40}
              height={40}
            />
            <h1
              className={`${publicSans.variable} font-normal! text-[2.2rem]!`}
            >
              {category.title}
            </h1>
          </div>
          <ul className="mt-8 flex flex-wrap gap-4">
            {data &&
              data[category.slug]?.length > 0 &&
              data[category.slug]
                .slice(0, category.slug === "fashion" ? 10 : undefined)
                .map((interest) => (
                  <li
                    key={interest._id}
                    onClick={() => toggleInterest(interest.slug)}
                    className={cx(
                      `flex w-fit items-center gap-2 px-5 py-3 rounded-full text-lg! cursor-pointer duration-300 hover:-translate-0.5 ${mulish.variable}`,
                      isSelected(interest.slug)
                        ? `bg-[#E7E7FF] dark:bg-[#191919]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3]`
                        : ` bg-white dark:bg-[#0D0D0D] text-[#1A1C1E] dark:text-white  border border-[#E5E5E5] dark:border-[#272727]`
                    )}
                  >
                    {interest.name}
                    <Plus
                      className={`duration-200 ${
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
