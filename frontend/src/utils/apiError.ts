import axios from "axios";

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

interface ApiErrorMessages {
  defaultMessage?: string;
  badRequestMessage?: string;
  networkMessage?: string;
  serverMessage?: string;
  notFoundMessage?: string;
  unauthorizedMessage?: string;
  forbiddenMessage?: string;
}

export const apiErrorMessages = {
  default: "\u05D0\u05D9\u05E8\u05E2\u05D4 \u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1 \u05DE\u05D0\u05D5\u05D7\u05E8 \u05D9\u05D5\u05EA\u05E8.",
  network: "\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05D4\u05EA\u05D7\u05D1\u05E8 \u05DC\u05E9\u05E8\u05EA. \u05D1\u05D3\u05E7\u05D5 \u05D0\u05EA \u05D4\u05D7\u05D9\u05D1\u05D5\u05E8 \u05DC\u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8 \u05D5\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
  server: "\u05D4\u05E9\u05E8\u05EA \u05D0\u05D9\u05E0\u05D5 \u05D6\u05DE\u05D9\u05DF \u05DB\u05E8\u05D2\u05E2. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1 \u05D1\u05E2\u05D5\u05D3 \u05DE\u05E1\u05E4\u05E8 \u05D3\u05E7\u05D5\u05EA.",
  notFound: "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DC\u05D4\u05E6\u05D2\u05D4.",
  unauthorized: "\u05D4\u05D7\u05D9\u05D1\u05D5\u05E8 \u05E4\u05D2. \u05D4\u05EA\u05D7\u05D1\u05E8\u05D5 \u05DE\u05D7\u05D3\u05E9 \u05D5\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
  forbidden: "\u05D0\u05D9\u05DF \u05DC\u05DA \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05D1\u05E6\u05E2 \u05D0\u05EA \u05D4\u05E4\u05E2\u05D5\u05DC\u05D4 \u05D4\u05D6\u05D5.",
};

export function getApiErrorMessage(
  error: unknown,
  messages: ApiErrorMessages = {},
) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      !error.response
    ) {
      return messages.networkMessage ?? apiErrorMessages.network;
    }

    const status = error.response.status;

    if (status === 400) {
      return (
        messages.badRequestMessage ??
        error.response.data?.error?.message ??
        messages.defaultMessage ??
        apiErrorMessages.default
      );
    }

    if (status === 401) {
      return messages.unauthorizedMessage ?? apiErrorMessages.unauthorized;
    }

    if (status === 403) {
      return messages.forbiddenMessage ?? apiErrorMessages.forbidden;
    }

    if (status === 404) {
      return messages.notFoundMessage ?? apiErrorMessages.notFound;
    }

    if (status >= 500) {
      return messages.serverMessage ?? apiErrorMessages.server;
    }
  }

  return messages.defaultMessage ?? apiErrorMessages.default;
}
