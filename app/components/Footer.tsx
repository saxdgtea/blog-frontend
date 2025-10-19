"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const Footer = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-green-800 text-white py-10 px-4"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold mb-2">🌱 FarmLife</h2>
          <p className="text-lg text-green-100">
            Growing beauty, one garden at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className=" text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                {" "}
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className=" text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className=" text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className=" text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:info@farm.com"
              className="underline hover:text-yellow-300"
            >
              info@farm.com
            </a>
            <br />
            Phone: <span className="block">+254 700 123456</span>
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-xs text-green-200 border-t border-green-600 pt-4">
        © {new Date().getFullYear()} FarmLife Landscaping. All rights reserved.
      </div>
    </motion.footer>
  );
};
