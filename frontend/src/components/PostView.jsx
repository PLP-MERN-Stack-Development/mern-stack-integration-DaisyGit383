import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";

export default function PostView() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await request(`/api/posts/${id}`);
      setPost(data.post || data);
      setComments(data.comments || []);
    };
    load();
  }, [id]);

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const newComment = { body: commentText };
    const saved = await request(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    setComments([...comments, saved.comment || saved]);
    setCommentText("");
  };

  if (loading && !post) return <p>Loading...</p>;
  if (error && !post) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <Link to="/" className="text-indigo-600">← Back</Link>
      {post && (
        <article className="bg-white p-6 rounded shadow mt-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {post.featuredImage && (
            <img src={post.featuredImage} alt="" className="w-full h-60 object-cover my-4" />
          )}
          <p dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      )}

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Comments</h2>
        {comments.map((c, i) => (
          <div key={i} className="border-b py-2">
            <p>{c.body}</p>
          </div>
        ))}
        <div className="flex mt-3 gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border p-2 rounded"
          />
          <button onClick={submitComment} className="bg-indigo-600 text-white px-4 py-1 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}