export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginField = keyof LoginFormValues;
export type LoginFieldErrors = Partial<Record<LoginField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginField = (
  field: LoginField,
  value: string,
): string => {
  switch (field) {
    case "email":
      if (!value.trim()) {
        return "יש להזין כתובת דוא\"ל.";
      }
      if (!emailPattern.test(value.trim())) {
        return "יש להזין כתובת דוא\"ל תקינה.";
      }
      return "";
    case "password":
      if (!value) {
        return "יש להזין סיסמה.";
      }
      return "";
    default:
      return "";
  }
};

export const validateLoginForm = (
  values: LoginFormValues,
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};

  (Object.keys(values) as LoginField[]).forEach((field) => {
    const error = validateLoginField(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
