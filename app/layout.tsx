import "./globals.css";
import ApolloWrapper from "@/components/ApolloWrapper";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ApolloWrapper>
          <Navbar />
          <main className="max-w-6xl mx-auto p-6">
            {children}
          </main>
        </ApolloWrapper>
      </body>
    </html>
  );
}