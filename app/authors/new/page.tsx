"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import AuthorForm from "@/components/AuthorForm";
import { CREATE_AUTHOR } from "@/graphql/mutations";
import { GET_AUTHORS } from "@/graphql/queries";

export default function NewAuthorPage() {
  const router = useRouter();

  const [createAuthor, { loading }] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const handleCreate = async (name: string) => {
    await createAuthor({ variables: { name } });
    router.push("/authors");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Author</h1>
        <Link href="/authors" className="btn btn-ghost btn-sm">
          Back
        </Link>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-4">
        <AuthorForm
          onSubmit={handleCreate}
          submitLabel="Create Author"
          isSubmitting={loading}
          onCancel={() => router.push("/authors")}
        />
      </div>
    </div>
  );
}
