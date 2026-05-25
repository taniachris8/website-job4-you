export type ContactFormField =
  | "userName"
  | "userEmail"
  | "userPhone"
  | "message"
  | "privacyConsent";

export interface ContactFormValues {
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  privacyConsent: boolean;
}

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

const namePattern = /^[A-Za-z\u0590-\u05FF]+(?:[ -][A-Za-z\u0590-\u05FF]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s-]{6,19}$/;

export const trimContactValue = (value: string) => value.trim();

const hasValidDigitCount = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

export const validateContactField = (field: ContactFormField, value: string) => {
  if (field === "privacyConsent") {
    return value === "true"
      ? ""
      : "יש לאשר את מדיניות הפרטיות לפני השליחה.";
  }

  const trimmedValue = trimContactValue(value);

  switch (field) {
    case "userName":
      if (!trimmedValue) {
        return "יש להזין שם.";
      }
      if (trimmedValue.length < 2) {
        return "השם חייב לכלול לפחות 2 תווים.";
      }
      if (!namePattern.test(trimmedValue)) {
        return "השם יכול לכלול אותיות, רווחים ומקפים בלבד.";
      }
      return "";
    case "userEmail":
      if (!trimmedValue) {
        return "יש להזין כתובת דוא\"ל.";
      }
      if (!emailPattern.test(trimmedValue)) {
        return "יש להזין כתובת דוא\"ל תקינה.";
      }
      return "";
    case "userPhone":
      if (!trimmedValue) {
        return "";
      }
      if (!phonePattern.test(trimmedValue) || !hasValidDigitCount(trimmedValue)) {
        return "יש להזין מספר טלפון תקין או להשאיר את השדה ריק.";
      }
      return "";
    case "message":
      if (!trimmedValue) {
        return "יש להזין הודעה.";
      }
      return "";
    default:
      return "";
  }
};

export const validateContactForm = (values: ContactFormValues) =>
  (Object.keys(values) as ContactFormField[]).reduce<ContactFormErrors>(
    (errors, field) => {
      const rawValue =
        field === "privacyConsent"
          ? String(values.privacyConsent)
          : values[field];
      const error = validateContactField(field, rawValue);

      if (error) {
        errors[field] = error;
      }

      return errors;
    },
    {},
  );

export const trimContactFormValues = (
  values: ContactFormValues,
): ContactFormValues => ({
  userName: trimContactValue(values.userName),
  userEmail: trimContactValue(values.userEmail),
  userPhone: trimContactValue(values.userPhone),
  message: trimContactValue(values.message),
  privacyConsent: values.privacyConsent,
});
