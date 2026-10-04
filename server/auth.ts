import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { Role, SessionUser } from "./types/express.js";

export type { Role, SessionUser };

const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
})();

const isProd = process.env.NODE_ENV === "production";

function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    (typeof user.email === "string" || user.email === null) &&
    (typeof user.discordId === "string" || user.discordId === null) &&
    (typeof user.microsoftId === "string" || user.microsoftId === null) &&
    (user.role === "user" || user.role === "supervisor" || user.role === "admin")
  );
}

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
  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  if (!isSessionUser(payload)) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  req.user = payload;
  next();
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
