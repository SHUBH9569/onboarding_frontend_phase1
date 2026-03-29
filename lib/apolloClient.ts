"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  uri: process.env.BACKENDURL,
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});