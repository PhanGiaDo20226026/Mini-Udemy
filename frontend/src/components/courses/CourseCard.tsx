import Link from "next/link";
import { BookOpen, Star, Users } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  price: number;
  level: string;
  instructor: { name: string };
  avgRating: number;
  _count: { enrollments: number; lessons: number };
}

export function CourseCard({ id, title, description, thumbnail, price, level, instructor, avgRating, _count }: CourseCardProps) {
  const levelColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800",
    INTERMEDIATE: "bg-yellow-100 text-yellow-800",
    ADVANCED: "bg-red-100 text-red-800",
  };

  return (
    <Link href={`/courses/${id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary-400 to-accent-500 relative overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white/70" />
            </div>
          )}
          <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${levelColors[level] || "bg-gray-100 text-gray-800"}`}>
            {level}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{instructor.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <span className="font-bold text-sm text-yellow-600">{avgRating.toFixed(1)}</span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-400">({_count.enrollments})</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">
              {price > 0 ? `${price.toLocaleString("vi-VN")}đ` : "Free"}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              {_count.lessons} lessons
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
