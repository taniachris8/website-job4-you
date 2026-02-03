import axios from "axios";
import { API_URL } from "../consts/general";
import type { User } from "../types";

const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`, {
      params: {
        username,
        password,
      },
    });

    if (response.data.length > 0) {
      return response.data[0]; // return user data
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? String(error);
    throw new Error("Error during login: " + message);
  }
};

export { login };
