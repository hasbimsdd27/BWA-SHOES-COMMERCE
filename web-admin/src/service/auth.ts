interface Payload {
  email: string;
  password: string;
}

export const LoginService = (payload: Payload) =>
  fetch(`${import.meta.env.VITE_API_URL}/login-admin`, {
    method: "POST",
    headers: { "Content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify(payload),
  });
