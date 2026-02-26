import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { authenticate, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
authRouter.post("/register", async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = generateToken(user.id, user.role);

  res.status(201).json({ user, token });
});

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken(user.id, user.role);

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    token,
  });
});

// GET /api/auth/me
authRouter.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.json({ user });
});
