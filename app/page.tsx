"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featured_image?: string | null;
  topic: string;
  createdAt: string;
  author?: string;
}

export default function HomePage() {
  const [headlines, setHeadlines] = useState<Blog[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const normalizeImageUrl = useCallback(
    (path?: string | null) => {
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return `${API_URL?.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
    },
    [API_URL]
  );

  const fetchHeadlines = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/blogs/headlines`);
      const data = await res.json();

      let blogs = Array.isArray(data) ? data : data.headlines || [];
      blogs = blogs.map((b: Blog) => ({
        ...b,
        featured_image: normalizeImageUrl(b.featured_image),
      }));

      setHeadlines(blogs);
    } catch (err) {
      console.error("Failed to fetch headlines", err);
      setHeadlines([]);
    }
  }, [API_URL, normalizeImageUrl]);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();

      const blogs = (Array.isArray(data) ? data : data.blogs || []).map(
        (b: Blog) => ({
          ...b,
          featured_image: normalizeImageUrl(b.featured_image),
        })
      );

      setBlogs(blogs);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      setBlogs([]);
    }
  }, [API_URL, normalizeImageUrl]);

  useEffect(() => {
    fetchHeadlines();
    fetchBlogs();
  }, [fetchHeadlines, fetchBlogs]);

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Headlines */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 bg-green-50 rounded-2xl shadow-lg p-4">
          <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
            Headlines
          </h2>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop
          >
            {headlines.length > 0 ? (
              headlines.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <Link href={`/blogs/${encodeURIComponent(blog.slug)}`}>
                    <div className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={blog.featured_image || "/placeholder.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {blog.title}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-200">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-gray-600">No headlines available</p>
            )}
          </Swiper>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <Link
              href={`/blogs/${encodeURIComponent(blog.slug)}`}
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col h-full"
              >
                <div className="relative">
                  <Image
                    src={blog.featured_image || "/placeholder.jpg"}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                  />
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-green-900">
                      {blog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm italic text-green-700 mt-2">
                    By {blog.author || "Admin"}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <p className="col-span-4 text-gray-600">No blogs found</p>
        )}
      </main>
    </div>
  );
}
