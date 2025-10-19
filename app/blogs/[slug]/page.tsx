"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featured_image?: string;
  topic: string;
  createdAt?: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${API_URL}/blogs/slug/${encodeURIComponent(slug as string)}`
        );
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data: Blog = await res.json();
        setBlog(data);

        if (data.topic) {
          const relRes = await fetch(
            `${API_URL}/blogs/topic/${encodeURIComponent(data.topic)}`
          );
          if (relRes.ok) {
            const relData: Blog[] = (await relRes.json()).blogs || [];
            setRelatedBlogs(relData.filter((b) => b.slug !== data.slug));
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug, API_URL]);

  if (loading) return <p className="p-6">Loading blog...</p>;
  if (!blog) return <p className="p-6">Blog not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <article className="mb-16">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        <p className="text-sm text-gray-600 mb-6">
          Topic:{" "}
          <span className="font-medium text-green-700">{blog.topic}</span>{" "}
          {blog.createdAt && (
            <>
              | Published:{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </>
          )}
        </p>

        {/* Featured Image */}
        <div className="relative w-full h-[450px] mb-8 rounded-xl shadow bg-gray-200">
          {blog.featured_image ? (
            <Image
              src={blog.featured_image}
              alt={blog.title || "Blog featured image"}
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImageOff className="w-10 h-10 mb-1 opacity-60" />
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="prose lg:prose-lg max-w-none">
          <p>{blog.content}</p>
        </div>
      </article>

      {relatedBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Related Blogs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedBlogs.map((rel) => (
              <Link
                key={rel._id}
                href={`/blogs/${rel.slug}`}
                className="block group rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  {rel.featured_image ? (
                    <Image
                      src={rel.featured_image}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <ImageOff className="w-10 h-10 mb-1 opacity-60" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-end">
                    <h3 className="text-white text-lg font-bold p-3 line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                    {rel.content.split(" ").slice(0, 25).join(" ")}...
                  </p>
                  <p className="text-xs text-gray-500">
                    {rel.topic}{" "}
                    {rel.createdAt &&
                      `| ${new Date(rel.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
