import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks($page: Int, $limit: Int, $title: String) {
    books(page: $page, limit: $limit, title: $title) {
      id
      title
      author {
        id
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

export const GET_AUTHORS = gql`
  query GetAuthors($page: Int, $limit: Int, $name: String) {
    authors(page: $page, limit: $limit, name: $name) {
      id
      name
      books {
        id
        title
      }
    }
  }
`;