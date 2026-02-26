"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name, role);
      router.push("/courses");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-500 mt-1">Start learning on Mini Udemy today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Nguyen Van A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex-1 py-3 rounded-md border-2 font-medium text-sm transition ${
                  role === "STUDENT"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                📚 Learn
              </button>
              <button
                type="button"
                onClick={() => setRole("INSTRUCTOR")}
                className={`flex-1 py-3 rounded-md border-2 font-medium text-sm transition ${
                  role === "INSTRUCTOR"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                🎓 Teach
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
