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
};

type BookFormProps = {
  authors: AuthorOption[];
  onSubmit: (values: BookFormValues) => Promise<void>;
  initialValues?: BookFormValues;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

export default function BookForm({
  authors,
  onSubmit,
  initialValues,
  submitLabel = "Save Book",
  isSubmitting = false,
  onCancel,
}: BookFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [authorId, setAuthorId] = useState(initialValues?.authorId ?? "");

  const handleSubmit = async () => {
    if (!title.trim() || !authorId.trim()) return;

    await onSubmit({
      title: title.trim(),
      authorId: authorId.trim(),
    });

    if (!initialValues) {
      setTitle("");
      setAuthorId("");
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <Input
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        list="author-options"
        placeholder="Select author by id"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
      />
      <datalist id="author-options">
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </datalist>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}