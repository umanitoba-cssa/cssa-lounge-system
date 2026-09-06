import type { Role } from "../auth.js";

export type Role = "user" | "supervisor" | "admin";

export interface SessionUser {
  id: number;
  name: string;
  email: string | null;
  discordId: string | null;
  microsoftId: string | null;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
