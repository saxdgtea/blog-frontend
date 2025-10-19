"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={`flex-1 ${
          !isAdminRoute ? "container mx-auto px-2 py-4" : ""
        }`}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
