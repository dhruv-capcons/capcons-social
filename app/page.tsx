import type { Metadata } from "next";
import Script from "next/script";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schema";
import { IMAGES } from "@/lib/images";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Capcons | Build, Grow & Monetize Your Creator Community",
  description:
    "Capcons empowers creators, entrepreneurs, and storytellers to build interest-driven communities. Launch your circle, grow your brand, and monetize your creativity — all on one platform.",
  keywords: [
    "Capcons",
    "creator communities",
    "creator monetization",
    "community platform",
    "social networking for creators",
    "build community online",
    "creator economy",
    "digital culture",
    "interest-based communities",
    "creator tools",
  ],
  alternates: {
    canonical: "https://capcons.com/",
  },
  openGraph: {
    title: "Capcons | Build, Grow & Monetize Your Creator Community",
    description:
      "From followers to culture — Capcons is the next evolution in social networking for creators, entrepreneurs, and brands. Build loyal communities, grow your influence, and monetize your creativity.",
    type: "website",
    url: "https://capcons.com/",
    images: [
      {
        url: IMAGES.og,
        width: 1200,
        height: 630,
        alt: "Capcons - Build, Grow & Monetize Your Creator Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capcons | Empowering Creators & Building Communities",
    description:
      "Capcons fuels creators, entrepreneurs, and storytellers by transforming social networking into culture-driven communities.",
    images: [IMAGES.twitter],
  },
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  redirect('/sign-up');

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

    </>
  );
}
