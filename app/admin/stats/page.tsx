"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogStat {
  id: number;
  title: string;
  views: number;
}

interface Stats {
  totalBlogs: number;
  totalViews: number;
  topBlogs: BlogStat[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/stats/summary`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        // Type-safe parsing
        const data = (await res.json()) as Partial<Stats>;

        setStats({
          totalBlogs: data.totalBlogs ?? 0,
          totalViews: data.totalViews ?? 0,
          topBlogs: Array.isArray(data.topBlogs)
            ? data.topBlogs.map((b) => ({
                id: b.id,
                title: b.title,
                views: b.views ?? 0,
              }))
            : [],
        });
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL, token]);

  if (loading) return <p className="p-6 text-gray-600">Loading stats...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Blog Statistics
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-green-100 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-green-800">Total Blogs</h2>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {stats?.totalBlogs}
          </p>
        </div>
        <div className="p-6 bg-green-100 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-green-800">Total Views</h2>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {stats?.totalViews}
          </p>
        </div>
      </div>

      {/* Top blogs */}
      <h2 className="text-xl font-semibold text-green-700 mb-4">Top Blogs</h2>
      <div className="space-y-3">
        {stats?.topBlogs?.length ? (
          stats.topBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="block p-4 bg-green-50 rounded-lg shadow hover:bg-green-100 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-900">{blog.title}</span>
                <span className="text-sm text-green-700">
                  {blog.views} views
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No top blogs yet.</p>
        )}
      </div>
    </div>
  );
}
