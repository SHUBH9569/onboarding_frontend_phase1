"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthorOption = {
  id: string;
  name: string;
};

type BookFormValues = {
  title: string;
  authorId: string;
  description: string;
  publishedDate: string;
};

type BookFormProps = {
  authors: AuthorOption[];
  onSubmit: (values: BookFormValues) => Promise<void>;
  initialValues?: Partial<BookFormValues>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  disableAuthorSelection?: boolean;
};

export default function BookForm({
  authors,
  onSubmit,
  initialValues,
  submitLabel = "Save Book",
  isSubmitting = false,
  onCancel,
  disableAuthorSelection = false,
}: BookFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [authorId, setAuthorId] = useState(initialValues?.authorId ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [publishedDate, setPublishedDate] = useState(
    initialValues?.publishedDate ?? ""
  );

  const handleSubmit = async () => {
    if (!title.trim() || !authorId.trim()) {
      alert("Title and Author are required");
      return;
    }

    await onSubmit({
      title: title.trim(),
      authorId: authorId.trim(),
      description: description.trim(),
      publishedDate,
    });

    if (!initialValues) {
      setTitle("");
      setAuthorId("");
      setDescription("");
      setPublishedDate("");
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <Input
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* ✅ FIXED SELECT */}
      <select
        className="input input-bordered w-full"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
        disabled={disableAuthorSelection || isSubmitting}
      >
        <option value="">Select Author</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </select>

      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        type="date"
        value={publishedDate}
        onChange={(e) => setPublishedDate(e.target.value)}
      />

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>

        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}