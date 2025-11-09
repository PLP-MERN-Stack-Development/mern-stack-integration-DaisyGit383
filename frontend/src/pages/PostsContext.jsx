import React, { createContext, useContext, useState } from "react";
import Api from "../lib/api";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const { request, loading, error, setError } = Api();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchPosts = async ({ page = 1, limit = 6, q = "" } = {}) => {
    const data = await request(`/api/posts?page=${page}&limit=${limit}&q=${q}`);
    setPosts(data.posts || []);
    setTotal(data.total || 0);
  };

  const createPost = async (payload) => {
    const options = {
      method: "POST",
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
    };
    const newPost = await request("/api/posts", options);
    setPosts([newPost, ...posts]);
  };

  const updatePost = async (id, payload) => {
    const options = {
      method: "PUT",
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
    };
    const updated = await request(`/api/posts/${id}`, options);
    setPosts(posts.map((p) => (p._id === id ? updated : p)));
  };

  const deletePost = async (id) => {
    await request(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <PostsContext.Provider
      value={{ posts, total, loading, error, fetchPosts, createPost, updatePost, deletePost, setError }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}