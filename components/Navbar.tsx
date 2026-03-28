"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, User, Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-xl mb-6">
      
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        📚 Library
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" className="flex gap-2">
            <Home size={18} /> Home
          </Button>
        </Link>

        <Link href="/books">
          <Button variant="ghost" className="flex gap-2">
            <Book size={18} /> Books
          </Button>
        </Link>

        <Link href="/authors">
          <Button variant="ghost" className="flex gap-2">
            <User size={18} /> Authors
          </Button>
        </Link>
      </div>
    </nav>
  );
}