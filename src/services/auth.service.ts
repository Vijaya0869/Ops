import {
  api,
  API_URL,
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
  // Full-page redirect into the backend's OAuth flow; it redirects back to
  // /auth/callback with a token once Google hands control back.
  window.location.href = `${API_URL}/auth/google`;
}

export async function completeGoogleSignIn(token: string): Promise<void> {
  setToken(token);
  const user = await api.get<AuthUser>("/auth/me");
  setSession(token, user);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch("/auth/me/password", { currentPassword, newPassword });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api.post("/auth/reset-password", { token, newPassword });
}
