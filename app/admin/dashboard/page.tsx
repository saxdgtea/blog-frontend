"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Stats {
  totalBlogs: number;
  totalViews: number;
  topBlog: { title: string; views: number } | null;
  recentBlogs: { _id: string; title: string; createdAt: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/blogs/stats/summary");
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Dashboard Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 text-sm">Total Blogs</h2>
          <p className="text-2xl font-bold">{stats?.totalBlogs ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 text-sm">Total Views</h2>
          <p className="text-2xl font-bold">{stats?.totalViews ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-gray-500 text-sm">Top Blog</h2>
          <p className="font-medium">
            {stats?.topBlog
              ? `${stats.topBlog.title} (${stats.topBlog.views} views)`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Recent blogs */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">Recent Blogs</h2>
        <ul className="space-y-2">
          {stats?.recentBlogs?.length ? (
            stats.recentBlogs.map((blog) => (
              <li key={blog._id} className="flex justify-between border-b pb-2">
                <span>{blog.title}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent blogs</li>
          )}
        </ul>
      </div>
    </div>
  );
}
