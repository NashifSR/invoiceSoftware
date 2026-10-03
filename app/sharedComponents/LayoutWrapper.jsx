"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/sharedComponents/Navbar";
import Footer from "@/app/sharedComponents/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}