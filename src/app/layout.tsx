import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gilroy = localFont({
  variable: "--font-gilroy",
  src: [
    {
      path: "./fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

const gilroyDisplay = localFont({
  variable: "--font-gilroy-display",
  src: [
    {
      path: "./fonts/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "aloo",
    template: "%s | aloo",
  },
  description:
    "aloo - smartfonlar bozori. Texno hayotga ulanish uchun telefonlar va gadjetlar storefronti.",
  applicationName: "aloo",
};

export const viewport: Viewport = {
  themeColor: "#1690F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${gilroy.variable} ${gilroyDisplay.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
