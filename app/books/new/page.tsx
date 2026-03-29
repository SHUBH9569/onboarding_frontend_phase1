"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Loader } from "@/components/ui/loader";

/* ---------------- GRAPHQL ---------------- */

const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $description: String
    $published_date: String
    $author_id: ID!
  ) {
    createBook(
      title: $title
      description: $description
      published_date: $published_date
      author_id: $author_id
    ) {
      id
      title
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
    }
  }
`;

/* ---------------- TYPES ---------------- */

type Author = {
  id: string;
  name: string;
};

type GetAuthorsResponse = {
  authors: Author[];
};

type CreateBookInput = {
  title: string;
  description?: string;
  published_date?: string;
  authorId: string;
};

type CreateBookResponse = {
  createBook: {
    id: string;
    title: string;
  };
};

type CreateBookVariables = {
  title: string;
  description?: string | null;
  published_date?: string | null;
  author_id: string;
};



export default function NewBookPage() {
  const router = useRouter();

  const { data, loading: loadingAuthors } =
    useQuery<GetAuthorsResponse>(GET_AUTHORS);

  const [createBook, { loading }] = useMutation<
    CreateBookResponse,
    CreateBookVariables
  >(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const authors = useMemo(() => data?.authors ?? [], [data?.authors]);

  const handleCreate = async (values: CreateBookInput) => {
    try {
      await createBook({
        variables: {
          title: values.title,
          description: values.description || null,
          published_date: values.published_date || null,
          author_id: values.authorId,
        },
      });

      router.push("/books");
    } catch (err) {
      console.error("Error creating book:", err);
    }
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
          <Loader/>
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



type BookFormProps = {
  authors: Author[];
  onSubmit: (values: CreateBookInput) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

function BookForm({
  authors,
  onSubmit,
  submitLabel,
  isSubmitting,
  onCancel,
}: BookFormProps) {
  const [form, setForm] = useState<CreateBookInput>({
    title: "",
    description: "",
    published_date: "",
    authorId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />
      </div>

      {/* Published Date */}
      <div>
        <label className="block mb-1 font-medium">Published Date</label>
        <input
          type="date"
          name="published_date"
          value={form.published_date}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block mb-1 font-medium">Author</label>
        <select
          name="authorId"
          value={form.authorId}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}