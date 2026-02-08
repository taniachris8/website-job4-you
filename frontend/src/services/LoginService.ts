import axios from "axios";
import { API_URL } from "../consts/general";
import type { User } from "../types";

const login = async (username: string, password: string): Promise<User> => {
  try {
  const response = await axios.post<{ user: User }>(`${API_URL}/auth/login`, {
    email: username,
    password,
  });

  if (response.data?.user) {
    return response.data.user;
  }
  throw new Error("Invalid username or password");
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? String(error);
    throw new Error("Error during login: " + message);
  }
};

export { login };
