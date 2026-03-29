"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_BOOKS } from "@/graphql/queries";
import { ADD_BOOK_REVIEW, DELETE_BOOK, UPDATE_BOOK } from "@/graphql/mutations";
import BookForm from "@/components/BookForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GET_AUTHORS } from "@/graphql/queries";
import { Loader } from "@/components/ui/loader";

type Book = {
  id: string;
  title: string;
  description?: string;
  publishedDate?: string;
  author?: {
    id?: string;
    name: string;
  };
  metadata?: {
    avgRating?: number;
    reviews?: {
      user: string;
      comment: string;
      rating: number;
    }[];
  };
};

type GetBooksResponse = {
  books: Book[];
};

type AuthorOption = {
  id: string;
  name: string;
};

type GetAuthorsResponse = {
  authors: AuthorOption[];
};

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [currentReviewUser, setCurrentReviewUser] = useState("Anonymous");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [reviewingBook, setReviewingBook] = useState<Book | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 8;

  const { data, loading, error } = useQuery<GetBooksResponse>(GET_BOOKS);
  const { data: authorData } = useQuery<GetAuthorsResponse>(GET_AUTHORS);
  const [updateBook, { loading: isUpdating }] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [addBookReview] = useMutation(ADD_BOOK_REVIEW, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  useEffect(() => {
    const candidates = ["username", "user", "name", "email"];
    for (const key of candidates) {
      const value = localStorage.getItem(key)?.trim();
      if (value) {
        setCurrentReviewUser(value);
        return;
      }
    }
  }, []);

  const books = useMemo(() => data?.books ?? [], [data?.books]);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return books;

    return books.filter((book) => {
      const byTitle = book.title.toLowerCase().includes(normalizedSearch);
      const byAuthor = (book.author?.name || "")
        .toLowerCase()
        .includes(normalizedSearch);
      return byTitle || byAuthor;
    });
  }, [books, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [currentPage, filteredBooks]);

  const pageBookIds = useMemo(
    () => paginatedBooks.map((book) => book.id),
    [paginatedBooks]
  );

  const allPageSelected =
    pageBookIds.length > 0 && pageBookIds.every((id) => selectedIds.includes(id));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const merged = new Set([...selectedIds, ...pageBookIds]);
      setSelectedIds(Array.from(merged));
      return;
    }

    setSelectedIds((prev) => prev.filter((id) => !pageBookIds.includes(id)));
  };

  const handleToggleSingle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }

    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleUpdateBook = async (values: {
    title: string;
    authorId: string;
    description: string;
    publishedDate: string;
  }) => {
    if (!editingBook) return;

    try {
      await updateBook({
        variables: {
          id: editingBook.id,
          title: values.title,
          description: values.description || null,
          published_date: values.publishedDate || null,
        },
      });

      setEditingBook(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Check console.");
    }
  };

  const handleDeleteSingle = async (id: string) => {
    setActiveDeleteId(id);
    try {
      await deleteBook({ variables: { id } });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    setActiveDeleteId("bulk");
    try {
      await Promise.all(selectedIds.map((id) => deleteBook({ variables: { id } })));
      setSelectedIds([]);
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleAddReview = async () => {
    if (!reviewingBook || !reviewComment.trim()) return;

    setReviewError(null);

    const parsedRating = Number.parseInt(reviewRating, 10);
    const safeRating = Number.isNaN(parsedRating)
      ? 5
      : Math.max(1, Math.min(parsedRating, 5));

    setActiveReviewId(reviewingBook.id);
    try {
      await addBookReview({
        variables: {
          bookId: reviewingBook.id,
          user: currentReviewUser,
          rating: safeRating,
          comment: reviewComment.trim(),
        },
      });

      setReviewComment("");
      setReviewRating("5");
      setReviewingBook(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      setReviewError(message);
    } finally {
      setActiveReviewId(null);
    }
  };

  // if (loading) return <p>Loading...</p>;
  if(loading) return <Loader/>
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Books</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-error btn-sm"
            disabled={!selectedIds.length || activeDeleteId === "bulk"}
            onClick={handleDeleteSelected}
          >
            {activeDeleteId === "bulk"
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </button>
          <Link href="/books/new" className="btn btn-primary btn-sm">
            Add Book
          </Link>
        </div>
      </div>

      {editingBook ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <h2 className="mb-3 text-lg font-semibold">Edit Book</h2>
          <BookForm
            key={editingBook.id}
            authors={authorData?.authors ?? []}
            onSubmit={handleUpdateBook}
            initialValues={{
              title: editingBook.title,
              authorId: editingBook.author?.id || "",
              description: editingBook.description || "",
              publishedDate: editingBook.publishedDate || "",
            }}
            submitLabel="Update Book"
            isSubmitting={isUpdating}
            onCancel={() => setEditingBook(null)}
            disableAuthorSelection
          />
        </div>
      ) : null}

      {reviewingBook ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <h2 className="mb-3 text-lg font-semibold">Add Review: {reviewingBook.title}</h2>
          <p className="mb-3 text-sm text-gray-500">Posting as: {currentReviewUser}</p>
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              type="number"
              min={1}
              max={5}
              placeholder="Rating"
              value={reviewRating}
              onChange={(event) => setReviewRating(event.target.value)}
            />
            <Input
              placeholder="Comment"
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddReview}
              disabled={activeReviewId === reviewingBook.id}
            >
              {activeReviewId === reviewingBook.id ? "Submitting..." : "Submit"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setReviewingBook(null)}>
              Cancel
            </button>
          </div>
          {reviewError ? <p className="mt-2 text-sm text-red-600">{reviewError}</p> : null}
        </div>
      ) : null}

      <Input
        placeholder="Filter by title or author"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className=" h-5 w-5 rounded-md 
             border border-gray-300 
             shadow-sm 
             hover:shadow 
              focus:ring-gray-400 focus:ring-offset-1 
             transition-all duration-200 
             cursor-pointer"
                    checked={allPageSelected}
                    onChange={(event) => handleToggleAll(event.target.checked)}
                  />
                </label>
              </th>
              <th>Title</th>
              <th>Author</th>
              <th>Average Rating</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((book) => {
              const isChecked = selectedIds.includes(book.id);
              const preview = book.description || "No description available";

              return (
                <tr key={book.id}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className=" h-5 w-5 rounded-md 
             border border-gray-300 
             shadow-sm 
             hover:shadow 
              focus:ring-gray-400 focus:ring-offset-1 
             transition-all duration-200 
             cursor-pointer"
                        checked={isChecked}
                        onChange={(event) =>
                          handleToggleSingle(book.id, event.target.checked)
                        }
                      />
                    </label>
                  </th>
                  <td className="font-medium">{book.title}</td>
                  <td>{book.author?.name || "Unknown"}</td>
                  <td>{book.metadata?.avgRating ?? "No ratings"}</td>
                  <td className="max-w-sm text-sm opacity-80">{preview}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditingBook(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setReviewingBook(book)}
                      >
                        Review
                      </button>
                      <Link href={`/books/${book.id}`} className="btn btn-ghost btn-xs">
                        Details
                      </Link>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteSingle(book.id)}
                        disabled={activeDeleteId === book.id}
                      >
                        {activeDeleteId === book.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!paginatedBooks.length ? (
        <p className="text-sm text-gray-500">No books found for this filter.</p>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
