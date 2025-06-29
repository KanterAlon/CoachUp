import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "CoachUp",
  description: "Manage your personal training business effortlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
