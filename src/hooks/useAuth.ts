import { useEffect, useState } from "react";
import * as authService from "@/services/auth.service";
import type { AuthUser } from "@/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    authService.getSession().then((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
  };

  return { user, loading, signOut };
}
