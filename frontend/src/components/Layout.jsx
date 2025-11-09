import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}