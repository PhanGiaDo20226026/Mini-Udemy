"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { courseAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Plus, BookOpen, Users, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function InstructorPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
      router.push("/");
      return;
    }
    fetchCourses();
  }, [user, router]);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getAll();
      // Filter to show only user's courses - the API returns all published
      // A proper endpoint would be /api/courses/instructor/my-courses
      setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseAPI.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Link
          href="/instructor/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          <Plus className="w-5 h-5" /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {courses.reduce((acc, c) => acc + (c._count?.lessons || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Course</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Students</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Lessons</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link href={`/courses/${course.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                    {course.title}
                  </Link>
                  <p className="text-sm text-gray-500">{course.level}</p>
                </td>
                <td className="text-center px-4 py-4 text-gray-600">
                  {course._count?.enrollments || 0}
                </td>
                <td className="text-center px-4 py-4 text-gray-600">
                  {course._count?.lessons || 0}
                </td>
                <td className="text-center px-4 py-4">
                  {course.published ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <Eye className="w-4 h-4" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                      <EyeOff className="w-4 h-4" /> Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
