export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const TOKEN_KEY = "ops_access_token";

export function resolveFileUrl(relativeUrl: string): string {
  return `${API_URL}${relativeUrl}`;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  companyName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type AuthListener = (user: AuthUser | null) => void;
const listeners = new Set<AuthListener>();
let currentUser: AuthUser | null = null;

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getCachedUser(): AuthUser | null {
  return currentUser;
}

export function setCachedUser(user: AuthUser): void {
  currentUser = user;
  notify();
}

export function setSession(token: string, user: AuthUser): void {
  setToken(token);
  currentUser = user;
  notify();
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  currentUser = null;
  notify();
}

export function onAuthChange(callback: AuthListener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = Array.isArray(body.message) ? body.message.join(", ") : body.message || message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
