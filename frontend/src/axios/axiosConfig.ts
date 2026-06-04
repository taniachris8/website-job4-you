import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../consts/general";

export const ACCESS_TOKEN_COOKIE = "access-token";
export const REFRESH_TOKEN_COOKIE = "refresh-token";
export const CSRF_TOKEN_COOKIE = "csrf-token";
export const TOKEN_TYPE_COOKIE = "token-type";

// Base Axios instance with baseURL
const api = axios.create({
  baseURL: API_URL, // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// Helper: Get CSRF Token
const getCsrfToken = () => Cookies.get(CSRF_TOKEN_COOKIE);

// Helper: Check if the token is expired
const isTokenExpired = (token?: string) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    const exp = decoded?.exp;
    if (exp === undefined) return true;
    return exp * 1000 < Date.now(); // Check expiration in milliseconds
  } catch {
    return true;
  }
};

// Helper: Save tokens to cookies
const isCookieSecure = () =>
  import.meta.env.VITE_COOKIE_SECURE === "true" ||
  window.location.protocol === "https:";

const saveTokens = (accessToken: string, refreshToken?: string) => {
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    secure: isCookieSecure(),
    sameSite: "Strict",
  });
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      secure: isCookieSecure(),
      sameSite: "Strict",
    });
  }
  Cookies.set(TOKEN_TYPE_COOKIE, "Bearer", {
    secure: isCookieSecure(),
    sameSite: "Strict",
  });
};

// Helper: Remove tokens from cookies
const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
  Cookies.remove(TOKEN_TYPE_COOKIE);
  Cookies.remove(CSRF_TOKEN_COOKIE);
};

// Function to refresh access token
const refreshAccessToken = async (shouldRedirect = false) => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, null, {
      withCredentials: true,
    });

    const { accessToken } = response.data;
    if (accessToken) {
      saveTokens(accessToken);
    }
    return accessToken ?? null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    if (shouldRedirect) {
      removeTokens();
      const signedOutUrl = import.meta.env.VITE_SIGNED_OUT_URL || "/login";
      window.location.href = signedOutUrl;
    }
    return null;
  }
};

// Axios Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";
    const skipAuth =
      url.endsWith("/auth/refresh") ||
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/register");

    if (!skipAuth) {
      let accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
      const hasStoredUser = Boolean(Cookies.get("user"));

      // The refresh token is stored by the backend in an HttpOnly cookie, so
      // JavaScript cannot reliably check whether it exists before refreshing.
      if ((accessToken && isTokenExpired(accessToken)) || (!accessToken && hasStoredUser)) {
        accessToken = await refreshAccessToken();
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Axios Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: Token is invalid or expired
      removeTokens();
    }
    if (error.response?.status === 403) {
      // Forbidden: CSRF or permission issue
      console.error("Forbidden: Check CSRF token or user permissions");
    }

    return Promise.reject(error);
  },
);

export default api; // Use this as the default export
