import axios from "axios";
import api from "../axios/axiosConfig";
import { API_URL } from "../consts/general";
import type { ContactFormValues } from "../utils/contactFormValidation";

interface FormSuccessResponse {
  success: boolean;
}

interface BackendErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

const buildFormData = (values: ContactFormValues, cvFile?: File | null) => {
  const formData = new FormData();
  formData.append("userName", values.userName);
  formData.append("userEmail", values.userEmail);
  formData.append("userPhone", values.userPhone);
  formData.append("message", values.message);
  formData.append("privacyConsent", String(values.privacyConsent));

  if (cvFile) {
    formData.append("cv", cvFile);
  }

  return formData;
};

export const submitContactForm = (values: ContactFormValues) =>
  api.post<FormSuccessResponse>(`${API_URL}/api/forms/contact`, values, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const submitApplyForm = (values: ContactFormValues, cvFile?: File | null) =>
  api.post<FormSuccessResponse>(
    `${API_URL}/api/forms/apply`,
    buildFormData(values, cvFile),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const submitRequestCvForm = (
  values: ContactFormValues,
  cvFile?: File | null,
) =>
  api.post<FormSuccessResponse>(
    `${API_URL}/api/forms/request-cv`,
    buildFormData(values, cvFile),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const getFormSubmissionErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    if (code === "PAYLOAD_TOO_LARGE" || status === 413) {
      return "הקובץ גדול מדי. ניתן לצרף קובץ עד 10MB.";
    }

    if (code === "TOO_MANY_REQUESTS" || status === 429) {
      return "בוצעו יותר מדי ניסיונות שליחה. נסו שוב בעוד כמה דקות.";
    }

    if (status === 400) {
      return "לא ניתן היה לשלוח את הטופס. בדקו את הפרטים ואת הקובץ המצורף ונסו שוב.";
    }

    if (status && status >= 500) {
      return "אירעה שגיאה בשליחת ההודעה. נסו שוב בעוד מספר דקות.";
    }

    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      !error.response
    ) {
      return "לא ניתן להתחבר לשרת כרגע. בדקו את החיבור ונסו שוב.";
    }
  }

  return "אירעה שגיאה בשליחת ההודעה. נסו שוב.";
};
