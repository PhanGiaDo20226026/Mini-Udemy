"use client";

import { useEffect, useState } from "react";
import { courseAPI } from "@/lib/api";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [level, setLevel] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page) };
      if (search) params.search = search;
      if (level) params.level = level;
      const { data } = await courseAPI.getAll(params);
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-[320px]" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No courses found. Try a different search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchCourses(i + 1)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    pagination.page === i + 1
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
