import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptCraft - Design the Perfect AI Prompt",
  description: "Generate structured and effective AI prompts with ease using a modern card-based interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
