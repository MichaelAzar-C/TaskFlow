const BASE = process.env.NEXT_PUBLIC_API_URL;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    // fetch only throws when no response arrived at all: server down, offline, CORS block
    throw new Error("Cannot reach the server. Please try again in a moment.");
  }

  const data = await res.json().catch(() => ({}));

  // Token expired or invalid: log out everywhere
  if (res.status === 401 && token) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}
