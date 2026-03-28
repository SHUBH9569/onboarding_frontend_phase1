import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Author = {
  id: string;
  name: string;
  books?: { id: string }[];
  biography?: string;
};

type AuthorCardProps = {
  author: Author;
  onEdit: (author: Author) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export default function AuthorCard({
  author,
  onEdit,
  onDelete,
  isDeleting = false,
}: AuthorCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">{author.name}</h2>
        <p className="text-sm text-gray-600">
          {author.biography ||
            `${author.name} is featured in this library and currently has ${author.books?.length || 0} listed books.`}
        </p>
        <p className="text-sm text-gray-500">
          Books: {author.books?.length || 0}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(author)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(author.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}