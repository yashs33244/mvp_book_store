import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./styles/theme.css";
import Navbar from "./components/Navbar";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Book Exchange Portal",
  description: "Connect with others to exchange or rent books",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
