import { Public_Sans, Mulish } from "next/font/google";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cx } from "class-variance-authority";
import { useGetInterests } from "@/hooks/useOnboard";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

const InterestSelection = () => {
  const { data, isLoading, error } = useGetInterests({ page: 1, length: 15 });
  const isSelected = true;

  if (isLoading)
    return (
      <div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#E7E7FF] dark:bg-[#3a3a3a]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3] rounded-full animate-pulse" />
          <div
            className={`${publicSans.variable} font-normal! w-64 h-10 rounded-full bg-[#E7E7FF] dark:bg-[#3a3a3a] animate-pulse`}
          />
        </div>
      </div>
    );
  console.log(data);

  return (
    <div className="space-y-22">
      <div>
        <div className="flex items-center gap-4">
          <Image
            src="/icons/trending.svg"
            alt="Dive into your Passion"
            width={40}
            height={40}
          />
          <h1 className={`${publicSans.variable} font-normal! text-[2.2rem]!`}>
            Trending
          </h1>
        </div>
        <ul className="mt-8 flex flex-wrap gap-4">
          {data &&
            data.length > 0 &&
            data.slice(0,10).map((interest,i) => (
              <li
                className={cx(
                  `flex w-fit items-center gap-2 px-5 py-3 rounded-full text-lg! cursor-pointer duration-300 hover:-translate-0.5 ${mulish.variable}`,
                  (i % 2 == 0)
                    ? `bg-[#E7E7FF] dark:bg-[#191919]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3]`
                    : ` bg-white dark:bg-[#0D0D0D] text-[#1A1C1E] dark:text-white  border border-[#E5E5E5] dark:border-[#272727]`
                )}
              >
                Ask India{" "}
                <Plus className={`duration-200 ${ (i % 2 == 0) && "rotate-45"}`} />{" "}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-4">
          <Image
            src="/icons/popcorn.svg"
            alt="Dive into your Passion"
            width={40}
            height={40}
          />
          <h1 className={`${publicSans.variable} font-normal! text-[2.2rem]!`}>
            Movies and Entertainment
          </h1>
        </div>
        <ul className="mt-8 flex flex-wrap gap-4">
          {data &&
            data.length > 0 &&
            data.slice(10).map((interest,i) => (
              <li
                className={cx(
                  `flex w-fit items-center gap-2 px-5 py-3 rounded-full text-lg! cursor-pointer duration-300 hover:-translate-0.5 ${mulish.variable}`,
                  (i % 2 == 0)
                    ? `bg-[#E7E7FF] dark:bg-[#191919]  border border-[#E7E7FF] dark:border-[#191919] text-[#39089D] dark:text-[#743FE3]`
                    : ` bg-white dark:bg-[#0D0D0D] text-[#1A1C1E] dark:text-white  border border-[#E5E5E5] dark:border-[#272727]`
                )}
              >
                Ask India{" "}
                <Plus className={`duration-200 ${ (i % 2 == 0) && "rotate-45"}`} />{" "}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default InterestSelection;
