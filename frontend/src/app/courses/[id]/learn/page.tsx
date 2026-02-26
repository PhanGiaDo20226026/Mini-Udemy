"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { courseAPI, lessonAPI, enrollmentAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Lock,
  List,
  X,
} from "lucide-react";

export default function LearnPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      courseAPI.getById(id as string),
      lessonAPI.getByCourse(id as string),
    ])
      .then(([courseRes, lessonsRes]) => {
        setCourse(courseRes.data.course);
        setLessons(lessonsRes.data.lessons);
        // Nếu có ?lesson=index thì mở bài đó
        const lessonIdx = parseInt(searchParams.get("lesson") || "0");
        const idx = Math.max(0, Math.min(lessonIdx, lessonsRes.data.lessons.length - 1));
        setCurrentIndex(idx);
        setCurrentLesson(lessonsRes.data.lessons[idx]);
      })
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
  }, [id, router, searchParams]);

  const selectLesson = (index: number) => {
    if (index >= 0 && index < lessons.length) {
      setCurrentIndex(index);
      setCurrentLesson(lessons[index]);
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !currentLesson) return;
    try {
      await enrollmentAPI.markProgress(currentLesson.id);
      // Move to next lesson
      if (currentIndex < lessons.length - 1) {
        selectLesson(currentIndex + 1);
      }
    } catch (err: any) {
      // Silently handle - user might not be enrolled
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const videoUrl = currentLesson.videoUrl;
  const hasVideo = videoUrl && !videoUrl.includes("example.com");

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-4">
        <button
          onClick={() => router.push(`/courses/${course.id}`)}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to course
        </button>
        <div className="flex-1 text-center">
          <span className="text-white font-medium text-sm truncate">{course.title}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          {/* Video player */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {hasVideo ? (
              <video
                key={currentLesson.id}
                controls
                autoPlay
                className="w-full h-full max-h-[calc(100vh-200px)]"
                controlsList="nodownload"
              >
                <source src={videoUrl} type="video/mp4" />
                Trình duyệt không hỗ trợ video.
              </video>
            ) : (
              <div className="text-center text-gray-500">
                <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Video chưa được upload</p>
                <p className="text-sm mt-1">Bài {currentIndex + 1}: {currentLesson.title}</p>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => selectLesson(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="text-center">
              <p className="text-white font-medium">{currentLesson.title}</p>
              <p className="text-gray-400 text-xs">
                Bài {currentIndex + 1} / {lessons.length} ·{" "}
                {Math.floor(currentLesson.duration / 60)}:{String(currentLesson.duration % 60).padStart(2, "0")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkComplete}
                className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" /> Complete & Next
              </button>
              <button
                onClick={() => selectLesson(currentIndex + 1)}
                disabled={currentIndex === lessons.length - 1}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Lesson list */}
        {sidebarOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Course Content</h3>
              <p className="text-gray-400 text-xs mt-1">{lessons.length} lessons</p>
            </div>
            <div>
              {lessons.map((lesson: any, index: number) => (
                <button
                  key={lesson.id}
                  onClick={() => selectLesson(index)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-700/50 hover:bg-gray-700/50 transition ${
                    index === currentIndex ? "bg-gray-700 border-l-2 border-l-primary-500" : ""
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      index === currentIndex
                        ? "bg-primary-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        index === currentIndex ? "text-white font-medium" : "text-gray-300"
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, "0")}
                    </p>
                  </div>
                  {lesson.free && index !== currentIndex && (
                    <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  )}
                  {!lesson.free && !lesson.videoUrl && (
                    <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
