"use client";

import Link from "next/link";
import { FaHome, FaBook, FaChartBar, FaTimes, FaBars } from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 z-40 transform 
        transition-transform duration-200 md:translate-x-0 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-green-600">Admin</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <FaHome /> <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <FaBook /> <span>Blogs</span>
          </Link>
          <Link
            href="/admin/stats"
            className="flex items-center space-x-2 hover:text-green-600"
          >
            <FaChartBar /> <span>Stats</span>
          </Link>
        </nav>
      </div>
    </>
  );
};
