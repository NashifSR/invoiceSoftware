"use client";

import { usePathname } from "next/navigation";

import { AuthProvider } from "@/Auth/context/AuthContext";
import "./globals.css";
import Navbar from "./sharedComponents/Navbar";
import Footer from "./sharedComponents/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {!isDashboard && <Navbar />}
          {children}
          {!isDashboard && <Footer/>}
        </AuthProvider>
      </body>
    </html>
  );
}