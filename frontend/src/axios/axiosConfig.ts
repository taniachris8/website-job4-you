// import axios from "axios";
// import Cookies from "js-cookie";
// import jwtDecode from "jwt-decode";
// import { API_URL } from "../consts/general";

// export const ACCESS_TOKEN_COOKIE = "access-token";
// export const REFRESH_TOKEN_COOKIE = "refresh-token";
// export const CSRF_TOKEN_COOKIE = "csrf-token";
// export const TOKEN_TYPE_COOKIE = "token-type";

// // Base Axios instance with baseURL
// const api = axios.create({
//   baseURL: API_URL, // Backend URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Helper: Get CSRF Token
// const getCsrfToken = () => Cookies.get(CSRF_TOKEN_COOKIE);

// // Helper: Check if the token is expired
// const isTokenExpired = (token) => {
//   if (!token) return true;
//   const { exp } = jwtDecode(token);
//   return exp * 1000 < Date.now(); // Check expiration in milliseconds
// };

// // Helper: Save tokens to cookies
// const saveTokens = (accessToken, refreshToken) => {
//   Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
//     secure: true,
//     sameSite: "Strict",
//   });
//   Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
//     secure: true,
//     sameSite: "Strict",
//   });
//   Cookies.set(TOKEN_TYPE_COOKIE, "Bearer", {
//     secure: true,
//     sameSite: "Strict",
//   });
// };

// // Helper: Remove tokens from cookies
// const removeTokens = () => {
//   Cookies.remove(ACCESS_TOKEN_COOKIE);
//   Cookies.remove(REFRESH_TOKEN_COOKIE);
//   Cookies.remove(TOKEN_TYPE_COOKIE);
//   Cookies.remove(CSRF_TOKEN_COOKIE);
//   //window.location.href = process.env.REACT_APP_SIGNED_OUT_URL || "/login"; // Redirect to login
// };

// // Function to refresh access token
// const refreshAccessToken = async () => {
//   const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
//   if (!refreshToken) {
//     removeTokens();
//     return null;
//   }

//   try {
//     const response = await axios.post(`${API_URL}/auth/refresh`, {
//       refreshToken,
//     });

//     const { accessToken, refreshToken: newRefreshToken } = response.data;
//     saveTokens(accessToken, newRefreshToken);
//     return accessToken;
//   } catch (error) {
//     console.error("Failed to refresh token:", error);
//     removeTokens();
//     return null;
//   }
// };

// // Axios Request Interceptor
// api.interceptors.request.use(
//   async (config) => {
//     if (!config.url.endsWith("/auth/refresh")) {
//       let accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);

//       // Refresh token if expired
//       if (isTokenExpired(accessToken)) {
//         accessToken = await refreshAccessToken();
//       }

//       // Add Authorization header
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }

//       // Add CSRF token if available
//       const csrfToken = getCsrfToken();
//       if (csrfToken) {
//         config.headers["X-CSRF-Token"] = csrfToken;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Axios Response Interceptor (Global Error Handling)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized: Token is invalid or expired
//       removeTokens();
//     }
//     if (error.response?.status === 403) {
//       // Forbidden: CSRF or permission issue
//       console.error("Forbidden: Check CSRF token or user permissions");
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

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
  withCredentials: true,
});

// Helper: Get CSRF Token
const getCsrfToken = () => Cookies.get(CSRF_TOKEN_COOKIE);

// Helper: Check if the token is expired
const isTokenExpired = (token?: string) => {
  if (!token) return true;
  const decoded = jwtDecode<{ exp?: number }>(token);
  const exp = decoded?.exp;
  if (exp === undefined) return true;
  return exp * 1000 < Date.now(); // Check expiration in milliseconds
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
  const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
  if (!refreshToken) {
    if (shouldRedirect) {
      removeTokens();
      const signedOutUrl = import.meta.env.VITE_SIGNED_OUT_URL || "/login";
      window.location.href = signedOutUrl;
    }
    return null;
  }

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
      const hasRefreshToken = Boolean(Cookies.get(REFRESH_TOKEN_COOKIE));

      // Refresh token if expired or missing
      if ((!accessToken || isTokenExpired(accessToken)) && hasRefreshToken) {
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
