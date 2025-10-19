"use client";

import Link from "next/link";
import { FaHome, FaBook, FaChartBar, FaUserCircle } from "react-icons/fa";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      {/* Left side - Nav Links */}
      <nav className="flex items-center space-x-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-2 hover:text-green-600"
        >
          <FaHome /> <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link
          href="/admin/blogs"
          className="flex items-center space-x-2 hover:text-green-600"
        >
          <FaBook /> <span className="hidden sm:inline">Blogs</span>
        </Link>
        <Link
          href="/admin/stats"
          className="flex items-center space-x-2 hover:text-green-600"
        >
          <FaChartBar /> <span className="hidden sm:inline">Stats</span>
        </Link>
      </nav>

      {/* Right side - Profile */}
      <div className="flex items-center space-x-2">
        <FaUserCircle size={28} className="text-gray-600" />
        <span className="hidden sm:block">Admin</span>
      </div>
    </header>
  );
};
