import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PostList from "./components/PostList";
import PostView from "./components/PostView";
import PostForm from "./components/PostForm";
import { PostsProvider} from "./pages/PostsContext";

export default function App() {
  return (
    <Router>
      <PostsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
          </Routes>
        </Layout>
      </PostsProvider>
    </Router>
  );
}