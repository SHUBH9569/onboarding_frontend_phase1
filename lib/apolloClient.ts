"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});