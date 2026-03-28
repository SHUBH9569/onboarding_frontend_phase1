"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import BookForm from "@/components/BookForm";
import { CREATE_BOOK } from "@/graphql/mutations";
import { GET_AUTHORS, GET_BOOKS } from "@/graphql/queries";

type Author = {
  id: string;
  name: string;
};

type GetAuthorsResponse = {
  authors: Author[];
};

export default function NewBookPage() {
  const router = useRouter();

  const { data, loading: loadingAuthors } =
    useQuery<GetAuthorsResponse>(GET_AUTHORS);

  const [createBook, { loading }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const authors = useMemo(() => data?.authors ?? [], [data?.authors]);

  const handleCreate = async (values: { title: string; authorId: string }) => {
    await createBook({
      variables: {
        title: values.title,
        author_id: values.authorId,
      },
    });

    router.push("/books");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Book</h1>
        <Link href="/books" className="btn btn-ghost btn-sm">
          Back
        </Link>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-4">
        {loadingAuthors ? (
          <p>Loading authors...</p>
        ) : (
          <BookForm
            authors={authors}
            onSubmit={handleCreate}
            submitLabel="Create Book"
            isSubmitting={loading}
            onCancel={() => router.push("/books")}
          />
        )}
      </div>
    </div>
  );
}
