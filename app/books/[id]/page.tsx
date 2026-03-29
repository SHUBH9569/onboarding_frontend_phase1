"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

const GET_BOOK_BY_ID = gql`
  query GetBook {
    books {
      id
      title
      author {
        name
      }
      metadata {
        avgRating
        reviews {
          user
          comment
          rating
        }
      }
    }
  }
`;


type PageProps = {
  params: Promise<{
    id: string;
  }>;
};
type Review = {
  user: string;
  comment: string;
  rating: number;
};

type Metadata = {
  avgRating: number | null;
  reviews: Review[];
};

type Author = {
  name: string;
};

type Book = {
  id: string;
  title: string;
  author?: Author | null;
  metadata?: Metadata | null;
};
interface BooksQueryResult {
  books: Book[];
}

export default function BookDetailsPage({ params }: PageProps) {
  const { id } = use(params);

  const { data, loading, error } =
    useQuery<BooksQueryResult>(GET_BOOK_BY_ID);

  if (loading) return <Loader/>;
  if (error) return <p>Error loading book</p>;

  const book = data?.books.find((b: Book) => b.id === id);

  if (!book) return <p>Book not found</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-500 mt-2">
            Author: {book.author?.name}
          </p>

          <p className="mt-4 text-lg">
            ⭐ Average Rating:{" "}
            {book.metadata?.avgRating || "No ratings yet"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>

        {book.metadata?.reviews?.length ? (
          <div className="space-y-3">
            {book.metadata.reviews.map((review: Review, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-sm text-gray-500">
                    Rating: ⭐ {review.rating}
                  </p>
                  <p className="mt-2">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
}