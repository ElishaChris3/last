"use client";

import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "./globals.css";

import { useState } from "react";
import Footers from "@/components/Footers/Footers";
import Navbar from "@/components/Navbar/Navbar";
import SignoutUnload from "@/components/SignoutUnload/SignoutUnload";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <Navbar />
          {children}
          <Footers />
        </Provider>
      </body>
    </html>
  );
}
