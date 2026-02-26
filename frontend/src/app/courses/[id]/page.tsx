"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courseAPI, enrollmentAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  PlayCircle,
  Lock,
  CheckCircle,
  User,
} from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      courseAPI
        .getById(id as string)
        .then(({ data }) => setCourse(data.course))
        .catch(() => router.push("/courses"))
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(course.id);
      alert("Enrolled successfully! 🎉");
      // Refresh the page
      const { data } = await courseAPI.getById(course.id);
      setCourse(data.course);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!course) return null;

  const totalDuration = course.lessons?.reduce((acc: number, l: any) => acc + l.duration, 0) || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {course.categories?.map((cat: any) => (
                  <span key={cat.category.id} className="px-3 py-1 bg-primary-600/30 text-primary-300 rounded-full text-sm">
                    {cat.category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{course.avgRating.toFixed(1)}</span>
                  <span className="text-gray-400">({course._count.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users className="w-4 h-4" />
                  {course._count.enrollments} students
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  {course._count.lessons} lessons
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {hours > 0 ? `${hours}h ` : ""}{minutes}m
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-gray-400">{course.instructor.bio || "Instructor"}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-white text-gray-900 rounded-xl p-6 shadow-lg h-fit">
              <div className="aspect-video bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg mb-4 flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <PlayCircle className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="text-3xl font-bold mb-4">
                {course.price > 0 ? `${course.price.toLocaleString("vi-VN")}đ` : "Free"}
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </button>
              <button
                onClick={() => router.push(`/courses/${course.id}/learn`)}
                className="w-full py-3 mt-2 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition"
              >
                ▶ Start Learning
              </button>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>✅ Full lifetime access</p>
                <p>✅ Access on mobile and desktop</p>
                <p>✅ Certificate of completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {course.lessons?.map((lesson: any, index: number) => (
              <div
                key={lesson.id}
                onClick={() => router.push(`/courses/${course.id}/learn?lesson=${index}`)}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  <p className="text-sm text-gray-500">
                    {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, "0")} min
                  </p>
                </div>
                {lesson.free ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" /> Free Preview
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {/* Reviews */}
          {course.reviews?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
              <div className="space-y-4">
                {course.reviews.map((review: any) => (
                  <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.user.name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
