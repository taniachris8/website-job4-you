import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import type { User } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_TYPE_COOKIE,
} from "../../axios/axiosConfig";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

interface LoginThunkResult {
  user: User;
}

interface AuthApiErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

const getStoredUser = (): User | null => {
  const storedUser = Cookies.get("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    Cookies.remove("user");
    return null;
  }
};

const normalizeUser = (user: Partial<User>, currentUser?: User | null): User => ({
  ...currentUser,
  ...user,
  _id: user._id ?? user.id ?? currentUser?._id ?? currentUser?.id,
  id: user.id ?? user._id ?? currentUser?.id ?? currentUser?._id,
}) as User;

const isCookieSecure = () =>
  import.meta.env.VITE_COOKIE_SECURE === "true" ||
  window.location.protocol === "https:";

const persistUser = (user: User) => {
  Cookies.set("user", JSON.stringify(user), { expires: 7 });
};

const persistTokens = (accessToken?: string, refreshToken?: string) => {
  if (accessToken) {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      secure: isCookieSecure(),
      sameSite: "Strict",
    });
  }

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      secure: isCookieSecure(),
      sameSite: "Strict",
    });
  }

  if (accessToken || refreshToken) {
    Cookies.set(TOKEN_TYPE_COOKIE, "Bearer", {
      secure: isCookieSecure(),
      sameSite: "Strict",
    });
  }
};

const clearPersistedAuth = () => {
  Cookies.remove("user");
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
  Cookies.remove(TOKEN_TYPE_COOKIE);
};

const invalidCredentialsMessage = "כתובת האימייל או הסיסמה שגויים";

const getLoginErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<AuthApiErrorResponse>(error)) {
    const apiMessage =
      error.response?.data?.error?.message ?? error.response?.data?.message ?? "";
    const normalizedMessage = apiMessage.toLowerCase();
    const status = error.response?.status;

    if (
      normalizedMessage.includes("incorrect password") ||
      normalizedMessage.includes("invalid credentials")
    ) {
      return invalidCredentialsMessage;
    }

    if (
      normalizedMessage.includes("user not found") ||
      normalizedMessage.includes("email not found")
    ) {
      return invalidCredentialsMessage;
    }

    if (status === 400 || status === 401) {
      return invalidCredentialsMessage;
    }
  }

  return getApiErrorMessage(error, {
    defaultMessage: "משהו השתבש. נסה שוב מאוחר יותר.",
    networkMessage: "משהו השתבש. נסה שוב מאוחר יותר.",
    serverMessage: "משהו השתבש. נסה שוב מאוחר יותר.",
    unauthorizedMessage: invalidCredentialsMessage,
  });
};

export const loginUser = createAsyncThunk<
  LoginThunkResult,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const apiService = new ApiService(API_URL);
    const response = await apiService.loginUser({ email, password });
    const { user, accessToken, refreshToken } = response.data;

    const normalizedUser = normalizeUser(user);
    persistUser(normalizedUser);
    persistTokens(accessToken, refreshToken);

    return { user: normalizedUser };
  } catch (error) {
    console.error("Login failed:", error);
    return rejectWithValue(getLoginErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  clearPersistedAuth();
});

const initialState: AuthState = {
  user: getStoredUser(),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    mergeUser(state, action: { payload: Partial<User> }) {
      state.user = normalizeUser(action.payload, state.user);
      persistUser(state.user);
    },
    clearAuthError(state) {
      state.error = null;
      if (state.status === "failed") {
        state.status = "idle";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? getApiErrorMessage(null);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { mergeUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
