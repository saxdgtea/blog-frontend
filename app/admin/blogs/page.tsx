"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Blog {
  id: number;
  title: string;
  topic: string;
  views: number;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // ✅ Always uses .env.local (NEXT_PUBLIC_API_URL)
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchBlogs = async (search?: string) => {
    try {
      const url = search
        ? `${API_URL}/blogs/search?q=${encodeURIComponent(search)}`
        : `${API_URL}/blogs`;

      console.log("🔹 Fetching blogs from:", url);

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok)
        throw new Error(
          `Failed to fetch blogs: ${res.status} ${res.statusText}`
        );

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.blogs || [];
      setBlogs(arr);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(query);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog?")) return;
    try {
      const url = `${API_URL}/blogs/${id}`;
      console.log("🗑️ Deleting blog at:", url);

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error(
          `Failed to delete blog: ${res.status} ${res.statusText}`
        );

      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  if (loading) return <div className="p-6">Loading blogs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">Manage Blogs</h1>
        <Link
          href="/admin/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + New Blog
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {/* Blog table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Topic</th>
              <th className="p-3">Views</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length ? (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{blog.title}</td>
                  <td className="p-3">{blog.topic}</td>
                  <td className="p-3">{blog.views}</td>
                  <td className="p-3">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
