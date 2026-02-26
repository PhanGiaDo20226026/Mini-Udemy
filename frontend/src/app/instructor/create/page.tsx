"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { courseAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function CreateCoursePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    level: "BEGINNER",
    thumbnail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push("/login");
    setLoading(true);
    try {
      const { data } = await courseAPI.create({
        ...form,
        price: Number(form.price),
      });
      alert("Course created successfully! 🎉");
      router.push(`/courses/${data.course.id}`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            minLength={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Complete React Developer Course"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            minLength={10}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe your course..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (VNĐ)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
          <input
            type="url"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
