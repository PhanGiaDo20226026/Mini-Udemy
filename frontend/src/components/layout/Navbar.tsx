"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { BookOpen, LogOut, User, GraduationCap } from "lucide-react";

export function Navbar() {
  const { user, logout, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-700">
            <GraduationCap className="w-8 h-8" />
            <span>Mini Udemy</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form action="/courses" method="GET" className="w-full">
              <input
                type="text"
                name="search"
                placeholder="Search for courses..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Courses
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/my-learning"
                  className="text-gray-600 hover:text-primary-600 font-medium"
                >
                  My Learning
                </Link>
                {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                  <Link
                    href="/instructor"
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    Instructor
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-500 ml-2"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-700 border border-primary-700 rounded-md hover:bg-primary-50"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
