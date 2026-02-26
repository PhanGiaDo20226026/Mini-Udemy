import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Udemy - Online Learning Platform",
  description: "Learn anything, anywhere. Mini Udemy is a learning platform with courses from expert instructors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">
              &copy; 2026 Mini Udemy. Built with Next.js + Express + PostgreSQL + Docker
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
