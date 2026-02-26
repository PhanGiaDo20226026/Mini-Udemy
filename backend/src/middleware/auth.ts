import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Access token required");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}

export function authorizeInstructor(req: AuthRequest, _res: Response, next: NextFunction) {
  if (req.userRole !== "INSTRUCTOR" && req.userRole !== "ADMIN") {
    throw new AppError(403, "Only instructors can perform this action");
  }
  next();
}
