import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "../globals.css";
import { IMAGES } from "@/lib/images";
import Image from "next/image";
import QueryProvider from "@/components/QueryProvider";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CapCons - Your Trusted Partner",
    template: "%s | CapCons",
  },
  description:
    "CapCons - Professional solutions and services for your business needs. Explore our features, pricing, and resources.",
  keywords: ["CapCons", "business solutions", "professional services"],
  authors: [{ name: "CapCons" }],
  creator: "CapCons",
  publisher: "CapCons",
  category: "Business Services",
  classification: "Business",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://capcons.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CapCons",
    title: "CapCons - Your Trusted Partner",
    description:
      "CapCons - Professional solutions and services for your business needs.",
    images: [
      {
        url: IMAGES.og,
        width: 1200,
        height: 630,
        alt: "CapCons - Your Trusted Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@capcons",
    creator: "@capcons",
    title: "CapCons - Your Trusted Partner",
    description:
      "CapCons - Professional solutions and services for your business needs.",
    images: [IMAGES.twitter],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      "facebook-domain-verification":
        process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || "",
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${openSans.variable} antialiased`}>
        <QueryProvider>
          <div className="min-h-screen max-h-screen overflow-hidden w-full">
            <Image
              src="/authbg.png"
              alt="Auth Background"
              layout="fill"
              className="object-cover object-center -z-10 relative hidden xmd:block"
            />

            <div
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 1))",
              }}
              className="absolute inset-0 z-40 hidden xmd:block"
            />

            <div className="min-h-screen max-h-screen relative z-50 overflow-hidden w-full flex items-center justify-center xmd:justify-between xmd:items-start xmd:p-10">
              <div className="text-white hidden xmd:block self-end max-w-3xl space-y-6 mb-8 ml-5">
                <p className={`text-[45px]! ${openSans.variable} leading-14! `}>
                  Hear And Share Stories With <br /> Circles That Share Your
                  Interests.
                </p>
                <p className={`text-xl! ${inter.variable} leading-7!`}>
                  Build communities around what you love. Create,
                  <br /> connect, and grow all on Capcons.
                </p>
              </div>

              <div
                style={{ height: "-webkit-fill-available" }}
                className="sm:min-w-110 max-w-110 max-h-[91.5vh] bg-green-500 rounded-lg flex-1 p-6 px-12 flex flex-col justify-start"
              >
                <div>
                  <Link href="/sign-up">
                    <Image
                      src="/capconsvg.svg"
                      alt="Capcons logo"
                      width={200}
                      height={52}
                      className="h-10 w-auto"
                      unoptimized
                    />
                  </Link>
                </div>
                <div
                  style={{ height: "-webkit-fill-available" }}
                  className="flex items-center text-black"
                >
                  {children}
                  <Analytics />
                </div>
              </div>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
