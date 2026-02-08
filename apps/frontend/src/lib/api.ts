const baseUrl: string = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    credentials: "include",
  });
  if (!res.ok) {
    let message = "";
    switch (res.status) {
      case 400:
        message = "Bad request.";
        break;
      case 403:
        message = "You are not authorized.";
        break;
      case 404:
        message = "Not found.";
        break;
      default:
        message = "Some errors occurred, please try later.";
    }
    throw new Error(message);
  }
  return res;
}
