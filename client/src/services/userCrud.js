import apiFetch from "./apiFetch";

export async function getUserToken({ username, password }) {
  return apiFetch(
    "/api/token/",
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );
}

export async function blacklistToken(refresh) {
  return apiFetch(
    "/api/logout/",
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    }
  );
}

export async function registerUser({ username, password }) {
  return apiFetch(
    "/api/register/",
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );
}
