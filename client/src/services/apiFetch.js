import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const apiOrigin = "http://localhost:8000";

// async function refreshToken(refreshToken) {
//   const url = "/api/token/refresh/";
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ refresh: refreshToken }),
//     });
//     if (!response.ok) {
//       const error = await response.text();
//       return { error, access: null };
//     }
//     const result = await response.json();
//     return { access: result.access, error: null };
//   } catch (error) {
//     console.error(error);
//     return { error: error, access: null };
//   }
// }

async function refreshToken() {
  const refresh = localStorage.getItem("jwtRefresh");
  if (!refresh) return;
  const access = localStorage.getItem("jwtAccess");
  const payload = jwtDecode(access);
  if (Date.now() / 1000 + 60 < payload.exp) return;
  const url = new URL("/api/token/refresh/", apiOrigin);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    localStorage.removeItem("jwtRefresh");
    localStorage.removeItem("jwtAccess");
    return;
  }
  const data = await response.json();
  localStorage.setItem("jwtRefresh", data.refresh);
  localStorage.setItem("jwtAccess", data.access);
  toast.info("Token refreshed successfully");
}

let refreshPromise = null;
function stalledRefreshToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = refreshToken();
  refreshPromise.finally(() => (refreshPromise = null));
  return refreshPromise;
}

export default async function apiFetch(url, searchParams, options = {}) {
  try {
    url = new URL(url, apiOrigin);
    if (searchParams) {
      for (const key in searchParams) {
        const value = searchParams[key];
        if (value == null) continue;
        url.searchParams.set(key, value);
      }
    }
    options = structuredClone(options);
    if (!options.headers) options.headers = {};
    await stalledRefreshToken();
    const token = localStorage.getItem("jwtAccess");
    if (token) options.headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(url, options);
    let data = await response.text();
    try {
      data = JSON.parse(data);
    } catch (error) {}
    const result = [data, null];
    if (!response.ok) result.reverse();
    return result;
  } catch (error) {
    return [null, error];
  }
}
