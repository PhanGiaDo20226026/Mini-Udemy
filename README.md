# 🎓 Mini Udemy - Online Learning Platform

A fullstack online learning platform built with **Next.js 14 + Express.js + PostgreSQL + Docker**.

## 🏗️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14, React 18, TailwindCSS, Zustand |
| Backend    | Express.js, TypeScript, Zod         |
| Database   | PostgreSQL 16, Prisma ORM           |
| DevOps     | Docker, Docker Compose              |
| Auth       | JWT (JSON Web Tokens), bcrypt       |

## 📁 Project Structure

```
mini-udemy-project/
├── backend/                 # Express.js API server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── lib/prisma.ts    # Prisma client
│   │   ├── middleware/       # Auth, error handling
│   │   └── routes/          # API routes
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   └── lib/             # API client, store
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# In another terminal, run database migration & seed
docker exec mini-udemy-backend npx prisma migrate dev --name init
docker exec mini-udemy-backend npx prisma db seed
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

### Option 2: Manual Setup

**Prerequisites:** Node.js 20+, PostgreSQL 16+

```bash
# 1. Start PostgreSQL (or use Docker for just the DB)
docker compose up postgres -d

# 2. Setup Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev

# 3. Setup Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description      | Auth |
|--------|-------------------|------------------|------|
| POST   | /api/auth/register | Register user    | ❌   |
| POST   | /api/auth/login    | Login            | ❌   |
| GET    | /api/auth/me       | Get current user | ✅   |

### Courses
| Method | Endpoint               | Description         | Auth |
|--------|------------------------|---------------------|------|
| GET    | /api/courses           | List courses        | ❌   |
| GET    | /api/courses/:id       | Get course detail   | ❌   |
| POST   | /api/courses           | Create course       | ✅ Instructor |
| PUT    | /api/courses/:id       | Update course       | ✅ Instructor |
| DELETE | /api/courses/:id       | Delete course       | ✅ Instructor |
| GET    | /api/courses/categories/all | Get categories | ❌   |

### Lessons
| Method | Endpoint                  | Description        | Auth |
|--------|---------------------------|--------------------|------|
| GET    | /api/lessons/course/:id   | Get course lessons | ❌   |
| GET    | /api/lessons/:id          | Get lesson detail  | ✅   |
| POST   | /api/lessons              | Create lesson      | ✅ Instructor |
| PUT    | /api/lessons/:id          | Update lesson      | ✅ Instructor |
| DELETE | /api/lessons/:id          | Delete lesson      | ✅ Instructor |

### Enrollments
| Method | Endpoint                 | Description           | Auth |
|--------|--------------------------|-----------------------|------|
| POST   | /api/enrollments         | Enroll in course      | ✅   |
| GET    | /api/enrollments/my      | My enrollments        | ✅   |
| POST   | /api/enrollments/progress| Mark lesson complete   | ✅   |
| POST   | /api/enrollments/review  | Add/update review     | ✅   |

## 🗄️ Database Schema

```
Users ──< Courses (instructor)
Users ──< Enrollments ──< LessonProgress
Courses ──< Lessons ──< LessonProgress
Courses ──< Enrollments
Courses ──< Reviews >── Users
Courses >──< Categories (many-to-many)
```

## 🔐 Demo Accounts

| Role       | Email                      | Password    |
|------------|----------------------------|-------------|
| Instructor | instructor@miniudemy.com   | password123 |
| Student    | student@miniudemy.com      | password123 |

## 🛠️ Development

```bash
# Run Prisma Studio (GUI for database)
cd backend && npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database
npx prisma migrate reset
```

## 📜 License

MIT
