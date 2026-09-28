/* ECUMT 3-01 — same-origin API client for the site Function. */
const SESSION_KEY = "ecumt-session";
const PATH_KEY = "ecumt-api-path";
const CANDIDATE_PATHS = ["/api", "/api/app", "/functions/v1/app", "/_functions/app", "/fn/app", "/app"];

export class ApiError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session && typeof session.token === "string" && session.user && session.user.id) return session;
  } catch (_) {}
  clearSession();
  return null;
}

export function saveSession(token, user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user })); } catch (_) {}
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
}

let basePath = null;
let discovering = null;

async function probePath(path) {
  try {
    const res = await fetch(path + "?action=me", { method: "GET", cache: "no-store" });
    const type = res.headers.get("content-type") || "";
    if (!type.includes("application/json")) return false;
    const data = await res.json();
    return !!(data && (data.user || data.error));
  } catch (_) {
    return false;
  }
}

async function discoverBase() {
  let stored = null;
  try { stored = localStorage.getItem(PATH_KEY); } catch (_) {}
  if (stored && (await probePath(stored))) return stored;
  for (const path of CANDIDATE_PATHS) {
    if (await probePath(path)) {
      try { localStorage.setItem(PATH_KEY, path); } catch (_) {}
      return path;
    }
  }
  throw new ApiError("api_unreachable", 0);
}

async function base() {
  if (basePath) return basePath;
  if (!discovering) {
    discovering = discoverBase().then((path) => {
      basePath = path;
      return path;
    });
  }
  return discovering;
}

export async function apiCall(action, { method = "GET", body = null, params = null } = {}) {
  const path = await base();
  const qs = new URLSearchParams({ action });
  if (params) for (const [key, value] of Object.entries(params)) qs.set(key, String(value));
  const session = readSession();
  const headers = {};
  if (session) headers["x-session-token"] = session.token;
  if (body !== null) headers["content-type"] = "application/json";
  let res;
  try {
    res = await fetch(path + "?" + qs.toString(), {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (_) {
    throw new ApiError("network_error", 0);
  }
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (res.status === 401 && data && data.error === "unauthorized") clearSession();
  if (!res.ok) throw new ApiError((data && data.error) || "request_failed", res.status);
  return data;
}

export const api = {
  signUp: (username, password, code) =>
    apiCall("signup", { method: "POST", body: code ? { username, password, code } : { username, password } }),
  logIn: (username, password) => apiCall("login", { method: "POST", body: { username, password } }),
  logOut: () => apiCall("logout", { method: "POST" }),
  me: () => apiCall("me"),
  answers: () => apiCall("answers"),
  saveAnswers: (answers) => apiCall("save-answers", { method: "POST", body: { answers } }),
  changePassword: (currentPassword, newPassword) =>
    apiCall("change-password", { method: "POST", body: { currentPassword, newPassword } }),
  students: () => apiCall("students"),
  student: (id) => apiCall("student", { params: { id } }),
  grade: (userId, outcome, score, comment) =>
    apiCall("grade", { method: "POST", body: { userId, outcome, score, comment } }),
};
