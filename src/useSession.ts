import { useEffect, useState } from "react";

type Role = "user" | "supervisor" | "admin";

interface SessionUser {
  id: number;
  name: string;
  email: string | null;
  discordId: string | null;
  microsoftId: string | null;
  role: Role;
}

// simple react hook for managing user session
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        setUser(res.ok ? await res.json() : null);
      } finally {
        setLoading(false);
      }
    };

    void fetchSession();
  }, []);
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return { user, loading, logout };
}
