const baseUrl: string = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res;
}
