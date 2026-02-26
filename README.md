# 🎓 Mini Udemy - Online Learning Platform

Nền tảng học trực tuyến fullstack xây dựng với **Next.js 14 + Express.js + PostgreSQL + Docker**.

Khoá học mẫu: **Khoá học phát âm Tiếng Anh** - 43 bài học video qua YouTube.

---

## 🏗️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 14, React 18, TailwindCSS, Zustand  |
| Backend    | Express.js, TypeScript, Prisma, Zod          |
| Database   | PostgreSQL 16, Prisma ORM                    |
| DevOps     | Docker, Docker Compose                       |
| Auth       | JWT (JSON Web Tokens), bcrypt                |

---

## 📁 Cấu trúc dự án

```
mini-udemy-project/
├── backend/                 # Express.js API server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (8 models)
│   │   └── seed.ts          # Dữ liệu mẫu
│   ├── src/
│   │   ├── index.ts         # Entry point (port 4000)
│   │   ├── middleware/       # Auth, error handling
│   │   └── routes/          # API routes
│   ├── scripts/             # Các script tiện ích
│   ├── public/              # Video files, static assets
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Navbar, CourseCard...
│   │   └── lib/             # API client, Zustand store
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker orchestration
└── README.md
```

---

## 🚀 Hướng dẫn chạy dự án (từng bước)

### Yêu cầu cài đặt trước

- **Docker Desktop** - Tải tại: https://www.docker.com/products/docker-desktop/
- **Git** - Tải tại: https://git-scm.com/downloads

> ⚠️ Đảm bảo Docker Desktop đang **chạy** (biểu tượng Docker xanh ở thanh taskbar) trước khi bắt đầu.

---

### Bước 1: Clone dự án

```bash
git clone https://github.com/PhanGiaDo20226026/Mini-Udemy.git
cd Mini-Udemy
```

---

### Bước 2: Khởi chạy Docker

```bash
docker compose up --build -d
```

Lệnh này sẽ tự động:
- Tạo database PostgreSQL
- Build và chạy Backend (Express.js) trên port **4000**
- Build và chạy Frontend (Next.js) trên port **3000**

⏱️ Lần đầu build có thể mất **3-5 phút** (tải Docker images + cài npm packages).

Kiểm tra containers đang chạy:

```bash
docker ps
```

Phải thấy 3 containers: `mini-udemy-db`, `mini-udemy-backend`, `mini-udemy-frontend`.

---

### Bước 3: Tạo database

Chạy migration để tạo bảng trong database:

```bash
docker exec mini-udemy-backend npx prisma migrate dev --name init
```

---

### Bước 4: Thêm dữ liệu mẫu (seed)

```bash
docker exec mini-udemy-backend npx prisma db seed
```

Lệnh này tạo:
- 2 tài khoản mẫu (Instructor + Student)
- 3 khoá học mẫu với bài học

---

### Bước 5: Import khoá học phát âm với 43 video YouTube

```bash
docker cp backend/scripts/import-youtube-urls.ts mini-udemy-backend:/app/scripts/import-youtube-urls.ts
docker cp backend/scripts/fix-encoding.ts mini-udemy-backend:/app/scripts/fix-encoding.ts
docker cp backend/public/link_youtube.txt mini-udemy-backend:/app/public/link_youtube.txt
docker exec mini-udemy-backend npx ts-node scripts/fix-encoding.ts
docker exec mini-udemy-backend npx ts-node scripts/import-youtube-urls.ts
```

> Lưu ý: Script `fix-encoding.ts` tạo khoá học phát âm với 43 bài học tiếng Việt có dấu.
> Script `import-youtube-urls.ts` gán 43 link YouTube vào các bài học.

---

### Bước 6: Mở trình duyệt

| Trang | URL |
|-------|-----|
| 🏠 Trang chủ | http://localhost:3000 |
| 📚 Danh sách khoá học | http://localhost:3000/courses |
| 🔐 Đăng nhập | http://localhost:3000/login |
| 📝 Đăng ký | http://localhost:3000/register |
| 🎬 Xem video học | http://localhost:3000/courses/[id]/learn |
| 🔧 Backend API | http://localhost:4000/api/health |

---

## 🔐 Tài khoản demo

| Vai trò    | Email                      | Mật khẩu    | Quyền |
|------------|----------------------------|-------------|-------|
| Giảng viên | instructor@miniudemy.com   | password123 | Tạo/sửa/xoá khoá học, quản lý bài học |
| Học viên   | student@miniudemy.com      | password123 | Đăng ký khoá, xem video, đánh giá |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Mô tả           | Auth |
|--------|-------------------|------------------|------|
| POST   | /api/auth/register | Đăng ký          | ❌   |
| POST   | /api/auth/login    | Đăng nhập        | ❌   |
| GET    | /api/auth/me       | Thông tin user   | ✅   |

### Courses
| Method | Endpoint               | Mô tả              | Auth |
|--------|------------------------|---------------------|------|
| GET    | /api/courses           | Danh sách khoá học  | ❌   |
| GET    | /api/courses/:id       | Chi tiết khoá học   | ❌   |
| POST   | /api/courses           | Tạo khoá học        | ✅ Instructor |
| PUT    | /api/courses/:id       | Cập nhật khoá học   | ✅ Instructor |
| DELETE | /api/courses/:id       | Xoá khoá học        | ✅ Instructor |

### Lessons
| Method | Endpoint                  | Mô tả             | Auth |
|--------|---------------------------|--------------------|------|
| GET    | /api/lessons/course/:id   | Bài học của khoá   | ❌   |
| GET    | /api/lessons/:id          | Chi tiết bài học   | ✅   |
| POST   | /api/lessons              | Tạo bài học        | ✅ Instructor |
| PUT    | /api/lessons/:id          | Cập nhật bài học   | ✅ Instructor |
| DELETE | /api/lessons/:id          | Xoá bài học        | ✅ Instructor |

### Enrollments
| Method | Endpoint                 | Mô tả                | Auth |
|--------|--------------------------|-----------------------|------|
| POST   | /api/enrollments         | Đăng ký khoá học      | ✅   |
| GET    | /api/enrollments/my      | Khoá học của tôi      | ✅   |
| POST   | /api/enrollments/progress| Đánh dấu hoàn thành   | ✅   |
| POST   | /api/enrollments/review  | Đánh giá khoá học     | ✅   |

---

## 🗄️ Database Schema

```
Users ──< Courses (instructor)
Users ──< Enrollments ──< LessonProgress
Courses ──< Lessons ──< LessonProgress
Courses ──< Enrollments
Courses ──< Reviews >── Users
Courses >──< Categories (many-to-many)
```

**8 models:** User, Course, Lesson, Enrollment, LessonProgress, Review, Category, CategoriesOnCourses

---

## 🛠️ Các lệnh hữu ích

```bash
# Xem logs của backend
docker logs mini-udemy-backend -f

# Xem logs của frontend
docker logs mini-udemy-frontend -f

# Mở Prisma Studio (GUI quản lý database)
docker exec -it mini-udemy-backend npx prisma studio

# Restart toàn bộ
docker compose restart

# Dừng toàn bộ
docker compose down

# Dừng và xoá database (reset hoàn toàn)
docker compose down -v
```

---

## ❓ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|------------|----------|
| `docker compose` không tìm thấy | Docker Desktop chưa cài hoặc chưa mở | Cài Docker Desktop và mở lên |
| Backend container restart liên tục | Prisma + OpenSSL lỗi | Đã fix trong Dockerfile (dùng node:20-slim) |
| `npx prisma db seed` lỗi | Chưa có config seed | Đã thêm vào package.json |
| Trang web trắng / không load | Container chưa build xong | Chờ 1-2 phút, kiểm tra `docker ps` |
| Video không phát | Chưa chạy script import YouTube URL | Chạy lại Bước 5 |

---

## 📜 License

MIT
