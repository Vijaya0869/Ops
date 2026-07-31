import {
  api,
  clearSession,
  getCachedUser,
  getToken,
  onAuthChange,
  setSession,
  setToken,
} from "./api-client";
import type { AuthUser } from "./api-client";

export type { AuthUser };

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const unsubscribe = onAuthChange(callback);
  return { unsubscribe };
}

export async function getSession(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  const cached = getCachedUser();
  if (cached) return cached;

  try {
    const user = await api.get<AuthUser>("/auth/me");
    setSession(token, user);
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return getSession();
}

export async function signOut(): Promise<void> {
  clearSession();
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { accessToken } = await api.post<{ accessToken: string }>("/auth/login", {
    email,
    password,
  });
  setToken(accessToken);
  const user = await api.get<AuthUser>("/auth/me");
  setSession(accessToken, user);
}

export async function signUp(email: string, password: string, fullName: string): Promise<void> {
  const { accessToken } = await api.post<{ accessToken: string }>("/auth/register", {
    email,
    password,
    fullName,
  });
  setToken(accessToken);
  const user = await api.get<AuthUser>("/auth/me");
  setSession(accessToken, user);
}

export async function signInWithGoogle(): Promise<void> {
  // Not implemented on the self-hosted backend yet — was already unconfigured
  // on the Supabase side too, so this preserves the same (non-)behavior.
  throw new Error("Google sign-in isn't available yet.");
}
