import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-indigo-600">
          My Blog
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-600">Posts</Link>
          <Link to="/create" className="px-3 py-1 rounded bg-indigo-600 text-white">Create</Link>
        </div>
      </div>
    </nav>
  );
}