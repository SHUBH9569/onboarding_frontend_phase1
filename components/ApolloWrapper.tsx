"use client";

import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/lib/apolloClient";
import {ReactNode} from "react"

type ApolloWrapperProps = {
  children: ReactNode;
};
export default function ApolloWrapper({ children } : ApolloWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}