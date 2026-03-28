import { gql } from "@apollo/client";

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String!) {
    updateAuthor(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author_id: ID!) {
    createBook(title: $title, author_id: $author_id) {
      id
      title
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $author_id: ID!) {
    updateBook(id: $id, title: $title, author_id: $author_id) {
      id
      title
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const ADD_BOOK_REVIEW = gql`
  mutation AddBookReview(
    $bookId: ID!
    $user: String!
    $rating: Int!
    $comment: String!
  ) {
    addReview(
      bookId: $bookId
      user: $user
      rating: $rating
      comment: $comment
    ) {
      avgRating
      reviews {
        user
        comment
        rating
      }
    }
  }
`;