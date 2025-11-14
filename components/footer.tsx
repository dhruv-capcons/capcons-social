"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedinIn,
  FaProductHunt,
  FaTwitter,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "COMPANY",
    links: [
      { name: "About", href: "/about-us" },
      { name: "Career", href: "/career" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { name: "Insights", href: "/insights" },
      { name: "Events", href: "/events" },
      { name: "Features", href: "/features" },
      { name: "FAQs", href: "/faq" },
    ],
  },
];

export function Footer() {
    const pathname = usePathname();
    const isAuthPage = pathname === "/sign-up" || pathname === "/login" || pathname === "/verify";
    

    if(isAuthPage) {
      return null;
    } 

  return (
    <section className="bg-footer pt-20 space-y-14">
      <div className="w-full flex flex-col-reverse lg:flex-row gap-10 px-5 sm:px-30 items-center justify-between">
        <div className="lg:w-1/2">
          <Image
            src="/videoplayer.png"
            alt="Capcons logo"
            width={560}
            height={380}
            className="h-52 sm:h-72 md:h-96 w-auto"
            unoptimized
          />
        </div>

        <div className="lg:w-1/2 flex flex-col items-start justify-center gap-10">
          <h2 className="text-2xl font-normal! font-sans text-center lg:text-left">
            Uniting <span className="text-[#39089D]">Creators</span>,{" "}
            <span className="text-[#39089D]">Communities</span>, and{" "}
            <span className="text-[#39089D]">Culture</span> to build what&apos;s
            next.
          </h2>

          <button className="bg-[#39089D] font-inter py-4.5 px-12 mx-auto lg:mx-0 text-white rounded-full text-[1.2rem] cursor-pointer">
            Book a Demo
          </button>
        </div>
      </div>

      <div className="w-full px-5 sm:px-30">
        <footer className="text-[var(--color-footer-text)] text-sm">
          <div className="w-full  flex lg:flex-row flex-col gap-10 items-center justify-between">
            <div className="lg:w-1/2">
              <div className="flex items-center -ml-5">
                <Image
                  src="https://assets.capcons.com/images/logo-footer.png"
                  alt="Capcons logo"
                  width={200}
                  height={52}
                  className="h-10 w-auto"
                  unoptimized
                />
              </div>
              <p className="mt-4 text-left font-normal! leading-5 font-inter text-base sm:max-w-md">
                Strengthen connections, drive engagement, and grow a thriving
                community. Reach your audience, foster loyalty, and monetize -
                free from ads and algorithms.
              </p>

              {/* social media links */}
              <div className="mt-7 flex flex-wrap items-center gap-4 font-sans text-sm">
                <a
                  href="https://www.instagram.com/capcons"
                  aria-label="Capcons on Instagram"
                  className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/capcons"
                  aria-label="Capcons on LinkedIn"
                  className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
                <a
                  href="https://www.twitter.com/capcons"
                  aria-label="Capcons on Twitter"
                  className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.producthunt.com/capcons"
                  aria-label="Capcons on Product Hunt"
                  className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaProductHunt className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 grid gap-3 gap-y-10 sm:gap-y-0 text-sm grid-cols-2 sm:grid-cols-3 justify-around  lg:mt-0">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-4 font-open-sans text-sm">
                  <h3 className="mb-6 font-inter text-sm! font-bold">
                    {section.title}
                  </h3>
                  <ul className="space-y-5 font-open-sans">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} className="hover:text-primary">
                        <Link
                          href={link.href}
                          className="text-[var(--color-footer-text)] transition-colors hover:text-primary font-open-sans"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h3 className="mb-6 font-inter text-sm! font-bold">
                  GET THE APP
                </h3>
                <div className="flex flex-col items-start justify-start gap-4">
                  <Image
                    src="/appstore.png"
                    alt="App Store"
                    width={145}
                    height={100}
                    className="h-11 w-auto"
                    unoptimized
                  />
                  <Image
                    src="/playstore.png"
                    alt="Play Store"
                    width={145}
                    height={100}
                    className="h-11 w-auto"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div></div>
          </div>
          <Separator className="my-10" />
          <div className="flex flex-col gap-6 pb-10 sm:flex-row items-center sm:justify-between font-sans text-sm">
            <Link
              href="/legal/terms-of-use"
              className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
            >
              Terms & Conditions
            </Link>

            <p className="text-center !text-sm">
              © Copyright {new Date().getFullYear()}, All Rights Reserved by
              Capcons
            </p>

            <Link
              href="/legal/privacy-policy"
              className="text-[var(--color-footer-text)] transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
