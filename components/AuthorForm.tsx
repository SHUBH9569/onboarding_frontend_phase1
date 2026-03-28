"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthorFormProps = {
  onSubmit: (name: string) => Promise<void>;
  initialName?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

export default function AuthorForm({
  onSubmit,
  initialName = "",
  submitLabel = "Save Author",
  isSubmitting = false,
  onCancel,
}: AuthorFormProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name.trim());
    if (!initialName) {
      setName("");
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Enter author name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
      {onCancel ? (
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}