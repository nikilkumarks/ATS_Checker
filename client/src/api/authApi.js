import API_URL from "./config";

const BASE_URL = `${API_URL}/api/auth`;

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await res.json();
  }

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text || `Request failed with status ${res.status}`,
      status: res.status
    };
  }
}

export const signupApi = async (data) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await parseResponse(res);
};

export const loginApi = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await parseResponse(res);
};

export const googleAuthApi = async (credential) => {
  const res = await fetch(`${BASE_URL}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential })
  });

  return await parseResponse(res);
};
