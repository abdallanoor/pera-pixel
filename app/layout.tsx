import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Perapixel Production",
  description:
    "Professional video editing services that transform your property listings into captivating visual experiences that sell.",
  keywords: [
    "video editing",
    "real estate video editing",
    "real estate videos",
    "property marketing",
    "Perapixel",
    "Perapixel Production",
    "Perapixel Agency",
    "editing services",
  ],
  authors: [{ name: "Perapixel Production" }],
  openGraph: {
    title: "Perapixel Production",
    description:
      "Professional video editing services that transform your property listings into captivating visual experiences that sell.",
    url: "https://www.perapixel.com",
    images: [
      {
        url: "/perapixel-logo.png",
        width: 1200,
        height: 630,
        alt: "Perapixel Production",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
