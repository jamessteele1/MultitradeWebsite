import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Multitrade Building Hire | Portable Buildings Queensland",
    template: "%s | Multitrade Building Hire",
  },
  description:
    "Queensland's largest privately owned fleet of portable buildings. Hire, sale, design & manufacture of crib rooms, site offices, ablutions, complexes & containers. Gladstone & Emerald. Est. 1980.",
  keywords: [
    "portable building hire",
    "portable buildings Queensland",
    "crib room hire",
    "site office hire",
    "mining accommodation",
    "transportable buildings QLD",
    "Gladstone portable buildings",
    "Multitrade Building Hire",
  ],
  openGraph: {
    title: "Multitrade Building Hire | Portable Buildings Queensland",
    description:
      "Queensland's largest privately owned fleet. Design, manufacture, hire, sale & installation of portable buildings since 1980.",
    url: "https://www.multitrade.com.au",
    siteName: "Multitrade Building Hire",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
