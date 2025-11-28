import type { Metadata } from "next";
import "../globals.css";
import { IMAGES } from "@/lib/images";
import AuthLayout from "@/components/AuthLayout";




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
 
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
