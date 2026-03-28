"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_AUTHORS } from "@/graphql/queries";
import { DELETE_AUTHOR, UPDATE_AUTHOR } from "@/graphql/mutations";
import AuthorForm from "@/components/AuthorForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Book = {
  id: string;
};

type Author = {
  id: string;
  name: string;
  books?: Book[];
};

type GetAuthorsResponse = {
  authors: Author[];
};

export default function AuthorsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 8;

  const { data, loading, error } = useQuery<GetAuthorsResponse>(GET_AUTHORS);

  const [updateAuthor, { loading: isUpdating }] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const authors = useMemo(() => data?.authors ?? [], [data?.authors]);

  const filteredAuthors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return authors;

    return authors.filter((author) =>
      author.name.toLowerCase().includes(normalizedSearch),
    );
  }, [authors, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAuthors.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAuthors.slice(start, start + pageSize);
  }, [currentPage, filteredAuthors]);

  const pageAuthorIds = useMemo(
    () => paginatedAuthors.map((author) => author.id),
    [paginatedAuthors],
  );

  const allPageSelected =
    pageAuthorIds.length > 0 &&
    pageAuthorIds.every((id) => selectedIds.includes(id));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const merged = new Set([...selectedIds, ...pageAuthorIds]);
      setSelectedIds(Array.from(merged));
      return;
    }

    setSelectedIds((prev) => prev.filter((id) => !pageAuthorIds.includes(id)));
  };

  const handleToggleSingle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }

    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleUpdate = async (name: string) => {
    if (!editingAuthor) return;

    await updateAuthor({
      variables: {
        id: editingAuthor.id,
        name,
      },
    });

    setEditingAuthor(null);
  };

  const handleDeleteSingle = async (id: string) => {
    setActiveDeleteId(id);
    try {
      await deleteAuthor({ variables: { id } });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    setActiveDeleteId("bulk");
    try {
      await Promise.all(
        selectedIds.map((id) => deleteAuthor({ variables: { id } })),
      );
      setSelectedIds([]);
    } finally {
      setActiveDeleteId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Authors</h1>
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
          <Link href="/authors/new" className="btn btn-primary btn-sm">
            Add Author
          </Link>
        </div>
      </div>

      {editingAuthor ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <h2 className="mb-3 text-lg font-semibold">Edit Author</h2>
          <AuthorForm
            onSubmit={handleUpdate}
            initialName={editingAuthor.name}
            submitLabel="Update Author"
            isSubmitting={isUpdating}
            onCancel={() => setEditingAuthor(null)}
          />
        </div>
      ) : null}

      <Input
        placeholder="Filter by author name"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />

      <div className="overflow-x-auto rounded-box border  border-base-300 bg-base-100">
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
              <th>Name</th>
              <th>Books</th>
              <th>Biography</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAuthors.map((author) => {
              const isChecked = selectedIds.includes(author.id);

              return (
                <tr key={author.id}>
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
                          handleToggleSingle(author.id, event.target.checked)
                        }
                      />
                    </label>
                  </th>
                  <td className="font-medium">{author.name}</td>
                  <td>{author.books?.length ?? 0}</td>
                  <td className="max-w-sm text-sm opacity-80">
                    {author.name} is listed in the library catalog.
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditingAuthor(author)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteSingle(author.id)}
                        disabled={activeDeleteId === author.id}
                      >
                        {activeDeleteId === author.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!paginatedAuthors.length ? (
        <p className="text-sm text-gray-500">
          No authors found for this filter.
        </p>
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
