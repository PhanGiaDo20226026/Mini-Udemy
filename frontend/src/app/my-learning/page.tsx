"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { enrollmentAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { BookOpen, ArrowRight } from "lucide-react";

export default function MyLearningPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    enrollmentAPI
      .getMyEnrollments()
      .then(({ data }) => setEnrollments(data.enrollments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h2>
          <p className="text-gray-400 mb-6">Start learning by enrolling in a course</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/courses/${enrollment.course.id}`}
              className="flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <div className="w-40 h-24 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {enrollment.course.instructor.name} · {enrollment.course._count.lessons} lessons
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {enrollment.progressPercent}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
