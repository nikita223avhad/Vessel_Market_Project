import { api } from "./http";
import type { AuthToken, RegisterPayload } from "./types";

export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const { data } = await api.post<AuthToken>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}
