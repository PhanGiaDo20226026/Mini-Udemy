import Link from "next/link";
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn without <span className="text-yellow-300">limits</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Start, switch, or advance your career with thousands of courses from expert instructors.
              Build skills with hands-on projects and earn certificates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Browse Courses <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                Join for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: "Courses", value: "100+" },
              { icon: Users, label: "Students", value: "10,000+" },
              { icon: GraduationCap, label: "Instructors", value: "50+" },
              { icon: Award, label: "Certificates", value: "5,000+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why choose Mini Udemy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Learn at your own pace",
                description: "Access courses anytime, anywhere. Learn on your schedule with lifetime access to purchased courses.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Expert instructors",
                description: "Learn from industry professionals and experienced educators who are passionate about teaching.",
                color: "bg-green-50 text-green-600",
              },
              {
                title: "Hands-on projects",
                description: "Build real-world projects and add them to your portfolio. Practice what you learn immediately.",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of students who are already learning on Mini Udemy.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
          >
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
