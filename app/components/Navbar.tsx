"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/blogs?q=${encodeURIComponent(query)}`);
      setQuery("");
      setShowMobileSearch(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-white">
            🌱 FarmLife
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block relative w-1/3">
            <input
              type="text"
              placeholder="Search blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full text-black bg-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-2 text-green-800"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Search icon */}
            <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <Search size={24} />
            </button>

            {/* Menu icon */}
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Field */}
        {showMobileSearch && (
          <div className="md:hidden flex items-center gap-2 py-2">
            <input
              type="text"
              placeholder="Search blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full text-black bg-white focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-4 py-2 rounded-full text-green-900 font-bold"
            >
              Go
            </button>
          </div>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between py-3 border-t border-green-700">
          <nav className="flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium relative group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 py-4 border-t border-green-700">
            <nav className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
