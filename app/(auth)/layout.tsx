import Image from "next/image";
import { Inter, Open_Sans } from "next/font/google";


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



export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full">
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

      <div className="min-h-screen w-full flex items-center xmd:items-start justify-center xmd:justify-between relative z-50 xmd:p-10">
        <div className="text-white hidden xmd:block self-end max-w-3xl space-y-6 mb-8 ml-5">
          <p className={`text-[45px]! ${openSans.variable} leading-14! `}>
            Hear And Share Stories With <br/> Circles That Share Your Interests.
          </p>
          <p className={`text-xl! ${inter.variable} leading-7!`}>
            Build communities around what you love. Create,<br/> connect, and grow
            all on Capcons.
          </p>
        </div>

        <div style={{height: "-webkit-fill-available"}} className="sm:min-w-110 max-w-110 bg-white rounded-lg flex-1 p-6 px-12 flex flex-col justify-start">
          <div>
          <Image
            src="https://assets.capcons.com/images/logo-footer.png"
            alt="Capcons logo"
            width={200}
            height={52}
            className="h-10 w-auto"
            unoptimized
          />
          </div>
          <div style={{height: "-webkit-fill-available"}} className="flex items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
