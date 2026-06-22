import { api } from "./http";
import type { User } from "./types";

export async function getUsers() {
  const { data } = await api.get<User[]>("/users/");
  return data;
}
