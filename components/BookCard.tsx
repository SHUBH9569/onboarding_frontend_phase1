"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Book = {
  id: string;
  title: string;
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

type ReviewInput = {
  user: string;
  rating: number;
  comment: string;
};

type BookCardProps = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onAddReview: (bookId: string, payload: ReviewInput) => Promise<void>;
  isDeleting?: boolean;
  isSubmittingReview?: boolean;
};

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onAddReview,
  isDeleting = false,
  isSubmittingReview = false,
}: BookCardProps) {
  const [user, setUser] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const previewText = `A quick preview of ${book.title} by ${book.author?.name || "Unknown author"}. Open details to read full reviews and ratings.`;

  const submitReview = async () => {
    if (!user.trim() || !comment.trim()) return;

    const parsedRating = Number.parseInt(rating, 10);
    const safeRating = Number.isNaN(parsedRating)
      ? 5
      : Math.max(1, Math.min(parsedRating, 5));

    await onAddReview(book.id, {
      user: user.trim(),
      rating: safeRating,
      comment: comment.trim(),
    });

    setUser("");
    setRating("5");
    setComment("");
  };

  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">{book.title}</h2>
        <p className="text-gray-500">By {book.author?.name}</p>
        <p className="text-sm text-gray-600">{previewText}</p>
        <p className="text-sm mt-2">
          ⭐ {book.metadata?.avgRating || "No ratings"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(book)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(book.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/books/${book.id}`}>Details</Link>
          </Button>
        </div>
        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-medium">Add Review</p>
          <Input
            placeholder="Your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <Input
            type="number"
            min={1}
            max={5}
            placeholder="Rating 1-5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <Input
            placeholder="Short review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={submitReview} disabled={isSubmittingReview}>
            {isSubmittingReview ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}