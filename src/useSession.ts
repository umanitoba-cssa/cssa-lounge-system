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
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return { user, loading, logout };
}
