"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ImageOff } from "lucide-react";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  content: string;
  featured_image: string | null;
  createdAt: string;
  topic: string;
  views: number;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ useCallback so useEffect dependency works
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = `${API_URL}/blogs`;

      if (query) {
        endpoint = `${API_URL}/blogs/search?q=${encodeURIComponent(query)}`;
      } else if (selectedTopic !== "all") {
        endpoint = `${API_URL}/blogs/topic/${selectedTopic}`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data: Blog[] =
        (await res.json()).blogs?.map((b: Blog) => ({
          _id: b._id,
          slug: b.slug,
          title: b.title,
          content: b.content,
          featured_image: b.featured_image ?? null,
          createdAt: b.createdAt,
          topic: b.topic,
          views: b.views ?? 0,
        })) || [];

      setBlogs(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  }, [API_URL, query, selectedTopic]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) return <p className="text-center">Loading blogs...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>

      {!query && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "cars", "food", "finance", "technology"].map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-lg ${
                selectedTopic === topic
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </button>
          ))}
        </div>
      )}

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${encodeURIComponent(blog.slug)}`}
            >
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer">
                <div className="relative h-48 w-full bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {blog.featured_image ? (
                    <Image
                      src={blog.featured_image}
                      alt={blog.title || "Blog featured image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ImageOff className="w-10 h-10 mb-1 opacity-60" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-semibold line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-xs text-green-600 mt-1">{blog.topic}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mt-2">
                  {blog.content}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No blogs found.</p>
      )}
    </div>
  );
}
