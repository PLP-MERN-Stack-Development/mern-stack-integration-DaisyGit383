import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../pages/PostsContext";

export default function PostList() {
  const { posts, total, loading, error, fetchPosts } = usePosts();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  useEffect(() => {
    // Call your fetchPosts function from context
    fetchPosts({ page, q });
  }, [page, q, fetchPosts]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts..."
          className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
        />
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-gray-600 text-center">Loading posts...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Posts Grid */}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-gray-600">No posts found.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {p.featuredImage && (
              <img
                src={p.featuredImage}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <Link
                to={`/posts/${p._id}`}
                className="block text-xl font-semibold text-indigo-600 hover:underline"
              >
                {p.title}
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                {p.excerpt || p.content?.slice(0, 120)}...
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {total > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Prev
          </button>

          <span className="text-gray-700">Page {page}</span>

          <button
            disabled={page * 5 >= total}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
