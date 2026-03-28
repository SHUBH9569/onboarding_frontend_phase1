"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-bold">
          📚 Library Dashboard
        </h1>
        <p className="text-base-content/70 text-lg">
          Manage your books and authors effortlessly
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Books Card */}
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-2xl">📖 Books</h2>
            <p className="text-base-content/70">
              View and manage all books in your library.
            </p>

            <div className="card-actions justify-end mt-4">
              <Link href="/books">
                <button className="btn btn-primary">
                  Go to Books →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Authors Card */}
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-2xl">👤 Authors</h2>
            <p className="text-base-content/70">
              Manage authors and their books.
            </p>

            <div className="card-actions justify-end mt-4">
              <Link href="/authors">
                <button className="btn btn-secondary">
                  Go to Authors →
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}