import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

// ===== Auth API =====
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ===== Course API =====
export const courseAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get("/courses", { params }),
  getById: (id: string) =>
    api.get(`/courses/${id}`),
  create: (data: any) =>
    api.post("/courses", data),
  update: (id: string, data: any) =>
    api.put(`/courses/${id}`, data),
  delete: (id: string) =>
    api.delete(`/courses/${id}`),
  getCategories: () =>
    api.get("/courses/categories/all"),
};

// ===== Lesson API =====
export const lessonAPI = {
  getByCourse: (courseId: string) =>
    api.get(`/lessons/course/${courseId}`),
  getById: (id: string) =>
    api.get(`/lessons/${id}`),
  create: (data: any) =>
    api.post("/lessons", data),
  update: (id: string, data: any) =>
    api.put(`/lessons/${id}`, data),
  delete: (id: string) =>
    api.delete(`/lessons/${id}`),
};

// ===== Enrollment API =====
export const enrollmentAPI = {
  enroll: (courseId: string) =>
    api.post("/enrollments", { courseId }),
  getMyEnrollments: () =>
    api.get("/enrollments/my"),
  markProgress: (lessonId: string) =>
    api.post("/enrollments/progress", { lessonId }),
  addReview: (data: { courseId: string; rating: number; comment?: string }) =>
    api.post("/enrollments/review", data),
};
