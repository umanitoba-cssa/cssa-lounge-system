import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { Role, SessionUser } from "./types/express.js";

export type { Role, SessionUser };

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const isProd = process.env.NODE_ENV === "production";

// basic cookie and auth functionalities
// ====================================
export function setSessionCookie(res: Response, user: SessionUser) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "30d" });
  res.cookie("session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax", // needed so the cookie lives after OAuth redirect back from Discord/Microsoft
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie("session");
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET) as SessionUser;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
