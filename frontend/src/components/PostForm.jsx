import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePosts } from "../pages/PostsContext";
import api from "../lib/api";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, createPost, updatePost } = usePosts();
  const { request } = api();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    featuredImageFile: null,
    author: "",
    viewCount: 0,
    comments: [] // store comments as an array of objects
  });
  const [errors, setErrors] = useState({});

  // Load existing post if editing
  useEffect(() => {
    if (id) {
      const existing = posts.find((p) => p._id === id);
      if (existing) setForm(existing);
      else {
        request(`/api/posts/${id}`)
          .then((data) => {
            if (data) setForm(data.post || data || {});
          })
          .catch((err) => console.error("Error loading post:", err));
      }
    }
  }, [id, posts, request]);

  // Validation
  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title required";
    if (!form.content?.trim()) e.content = "Content required";
    if (!form.author?.trim()) e.author = "Author required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let payload;
    if (form.featuredImageFile) {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (k !== "featuredImageFile") {
          const value = form[k];
          // Convert objects/arrays to JSON strings
          fd.append(k, typeof value === "object" ? JSON.stringify(value) : value);
        }
      });
      fd.append("featuredImage", form.featuredImageFile);
      payload = fd;
    } else {
      // convert objects/arrays to JSON before sending
      payload = { ...form };
      if (Array.isArray(payload.comments)) payload.comments = JSON.stringify(payload.comments);
    }

    try {
      if (id) await updatePost(id, payload);
      else await createPost(payload);
      navigate("/");
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  // Handle adding a comment
  const addComment = () => {
    setForm({ ...form, comments: [...form.comments, { name: "", content: "" }] });
  };

  // Handle comment change
  const handleCommentChange = (index, field, value) => {
    const updated = [...form.comments];
    updated[index][field] = value;
    setForm({ ...form, comments: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{id ? "Edit Post" : "Create Post"}</h1>

      <div>
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label>Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full border p-2 rounded"
          rows={10}
        />
        {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
      </div>

      <div>
        <label>Excerpt</label>
        <input
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Featured Image</label>
        <input
          type="file"
          onChange={(e) =>
            setForm({ ...form, featuredImageFile: e.target.files ? e.target.files[0] : null })
          }
        />
      </div>

      <div>
        <label>Author</label>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="w-full border p-2 rounded"
        />
        {errors.author && <p className="text-red-600 text-sm">{errors.author}</p>}
      </div>

      <div>
        <label>View Count</label>
        <input
          type="number"
          value={form.viewCount}
          onChange={(e) => setForm({ ...form, viewCount: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Comments</label>
        {form.comments.map((comment, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <input
              placeholder="Name"
              value={comment.name}
              onChange={(e) => handleCommentChange(idx, "name", e.target.value)}
              className="w-full border p-1 rounded mb-1"
            />
            <textarea
              placeholder="Comment"
              value={comment.content}
              onChange={(e) => handleCommentChange(idx, "content", e.target.value)}
              className="w-full border p-1 rounded"
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addComment}
          className="bg-green-500 text-white px-2 py-1 rounded mt-2"
        >
          Add Comment
        </button>
      </div>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
      <Link to="/" className="ml-2 border px-4 py-2 rounded">Cancel</Link>
    </form>
  );
}