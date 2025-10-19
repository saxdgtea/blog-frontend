"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface Blog {
  _id: string;
  title: string;
  topic: string;
  content: string;
  featured_image?: string;
  views: number;
  created_at: string;
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);
        const data = await res.json();
        setBlog(data);
        setTitle(data.title);
        setTopic(data.topic);
        setContent(data.content);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id, API_URL]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("content", content);
      if (featuredImage) formData.append("featured_image", featuredImage);

      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      setBlog(data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading blog...</div>;
  if (!blog) return <div className="p-6 text-red-500">Blog not found.</div>;

  return (
    <article className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <FaEdit className="mr-2" /> Edit Blog
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className={`flex items-center px-4 py-2 rounded-md text-white ${
                saving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FaSave className="mr-2" /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        )}
      </div>

      {!editMode ? (
        <>
          <h1 className="text-3xl font-bold mb-2 text-green-700">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            {blog.topic} • {new Date(blog.created_at).toLocaleDateString()} •{" "}
            {blog.views} views
          </p>

          {blog.featured_image && (
            <div className="relative w-full h-64 mb-6">
              <Image
                src={blog.featured_image}
                alt={blog.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </>
      ) : (
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Topic"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Content"
          />
          <input
            type="file"
            onChange={(e) =>
              setFeaturedImage(e.target.files ? e.target.files[0] : null)
            }
          />

          {(featuredImage || blog.featured_image) && (
            <div className="relative w-full h-64 mt-2">
              <Image
                src={
                  featuredImage
                    ? URL.createObjectURL(featuredImage)
                    : blog.featured_image!
                }
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
