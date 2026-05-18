import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import { mergeUser, logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { Button } from "../../components/button/Button";
import { ConfirmationModal } from "../../components/confirmation-modal/ConfirmationModal";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { getApiErrorMessage } from "../../utils/apiError";

import "./UserSettings.css";

type EditableField = "name" | "familyName" | "email";
type FieldErrors = Partial<Record<EditableField, string>>;

const namePattern = /^[\p{L}]+(?:[ -][\p{L}]+)*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserSettingsPage() {
  const userApiService = new ApiService(API_URL);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState({
    name: false,
    familyName: false,
    password: false,
    email: false,
  });
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name ?? "",
    familyName: user?.familyName ?? "",
    email: user?.email ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [settingsErrorMessage, setSettingsErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUpdatedUser({
      name: user?.name ?? "",
      familyName: user?.familyName ?? "",
      email: user?.email ?? "",
    });
  }, [user?.email, user?.familyName, user?.name]);

  const validateField = (field: EditableField, value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      if (field === "email") {
        return "Email is required.";
      }

      return field === "name"
        ? "First name is required."
        : "Last name is required.";
    }

    if (
      (field === "name" || field === "familyName") &&
      !namePattern.test(trimmedValue)
    ) {
      return field === "name"
        ? "First name can only include letters, spaces, and hyphens."
        : "Last name can only include letters, spaces, and hyphens.";
    }

    if (field === "email" && !emailPattern.test(trimmedValue)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleEditClick = (field: keyof typeof isEditing) => {
    if (field === "password") {
      return;
    }

    setIsEditing((currentState) => ({ ...currentState, [field]: true }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  };

  const handleSaveClick = async (field: EditableField) => {
    const validationError = validateField(field, updatedUser[field]);

    if (validationError) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validationError,
      }));
      return;
    }

    try {
      setSettingsErrorMessage("");
      const userId = user?.id ?? user?._id;
      if (!userId) return;
      const response = await userApiService.updateUser(userId, {
        [field]: updatedUser[field].trim(),
      });

      if (response.status === 200) {
        const normalizedValue = updatedUser[field].trim();
        setUpdatedUser((currentUser) => ({
          ...currentUser,
          [field]: normalizedValue,
        }));
        dispatch(mergeUser({ ...user, [field]: normalizedValue }));
        setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
        setIsEditing((currentState) => ({ ...currentState, [field]: false }));
      } else {
        console.error("Failed to update user");
        setSettingsErrorMessage(
          "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setSettingsErrorMessage(
        getApiErrorMessage(error, {
          defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        }),
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as EditableField;

    setUpdatedUser((currentUser) => ({ ...currentUser, [field]: value }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateField(field, value),
    }));
  };

  const handleDeleteAccount = async () => {
    const userId = user?.id ?? user?._id;

    if (!userId) {
      setDeleteErrorMessage(
        "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05D7\u05E9\u05D1\u05D5\u05DF. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
      );
      return;
    }

    setIsDeleting(true);
    setDeleteErrorMessage("");

    try {
      const response = await userApiService.deleteUser(userId);

      if (response.status === 200 || response.status === 204) {
        setShowDeleteConfirmModal(false);
        await dispatch(logoutUser()).unwrap();
        navigate("/login", {
          replace: true,
          state: {
            message: "Your account has been deleted successfully.",
          },
        });
      } else {
        setDeleteErrorMessage(
          "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05D7\u05E9\u05D1\u05D5\u05DF. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setDeleteErrorMessage(
        getApiErrorMessage(error, {
          defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05D7\u05E9\u05D1\u05D5\u05DF. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        }),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = () => {
    setDeleteErrorMessage("");
    setShowDeleteConfirmModal(true);
  };

  const handlePasswordRecovery = () => {
    navigate("/password-recovery");
  };

  const renderFieldInput = (
    field: EditableField,
    type: "text" | "email" = "text",
  ) => (
    <div className="settings-field-wrapper">
      <input
        type={type}
        name={field}
        value={updatedUser[field]}
        onChange={handleInputChange}
        className={
          fieldErrors[field]
            ? "settings-input settings-input-error"
            : "settings-input"
        }
        aria-invalid={Boolean(fieldErrors[field])}
        aria-describedby={fieldErrors[field] ? `${field}-error` : undefined}
      />
      {fieldErrors[field] ? (
        <p id={`${field}-error`} className="settings-error-message">
          {fieldErrors[field]}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <section className="users-settings-container">
        <div className="settings-page-shell">
          <div className="settings-main-column">
            <header className="settings-page-header">
              <p className="settings-eyebrow">Account settings</p>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">
                Keep your personal details up to date so your account stays
                accurate, accessible, and ready for future activity.
              </p>
            </header>

            {deleteErrorMessage ? (
              <ErrorMessage
                className="settings-alert"
                message={deleteErrorMessage}
                compact
              />
            ) : null}

            {settingsErrorMessage ? (
              <ErrorMessage
                className="settings-alert"
                message={settingsErrorMessage}
                compact
              />
            ) : null}

            <section className="settings-card" aria-label="Profile settings">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Profile information</h2>
                <p className="settings-card-description">
                  Update the details connected to your account.
                </p>
              </div>

              <div className="settings-list">
                <div className="settings-row">
                  <div className="settings-row-copy">
                    <span className="settings-row-label">Name</span>
                    <div className="settings-row-value">
                      {isEditing.name ? renderFieldInput("name") : user?.name}
                    </div>
                  </div>
                  <div className="settings-row-action">
                    {isEditing.name ? (
                      <Button
                        variant="save"
                        onClick={() => handleSaveClick("name")}>
                        Save
                      </Button>
                    ) : (
                      <button
                        type="button"
                        className="settings-icon-button"
                        onClick={() => handleEditClick("name")}
                        aria-label="Edit name">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-row-copy">
                    <span className="settings-row-label">Family Name</span>
                    <div className="settings-row-value">
                      {isEditing.familyName
                        ? renderFieldInput("familyName")
                        : user?.familyName}
                    </div>
                  </div>
                  <div className="settings-row-action">
                    {isEditing.familyName ? (
                      <Button
                        variant="save"
                        onClick={() => handleSaveClick("familyName")}>
                        Save
                      </Button>
                    ) : (
                      <button
                        type="button"
                        className="settings-icon-button"
                        onClick={() => handleEditClick("familyName")}
                        aria-label="Edit family name">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-row-copy">
                    <span className="settings-row-label">Email</span>
                    <div className="settings-row-value">
                      {isEditing.email
                        ? renderFieldInput("email", "email")
                        : user?.email}
                    </div>
                  </div>
                  <div className="settings-row-action">
                    {isEditing.email ? (
                      <Button
                        variant="save"
                        onClick={() => handleSaveClick("email")}>
                        Save
                      </Button>
                    ) : (
                      <button
                        type="button"
                        className="settings-icon-button"
                        onClick={() => handleEditClick("email")}
                        aria-label="Edit email">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="settings-side-column">
            <div className="settings-side-card reset-password-wrapper">
              <p className="settings-side-eyebrow">Security</p>
              <h2 className="settings-side-title">Password reset</h2>
              <p className="settings-side-text">
                If you want to change your password, we will send you an email
                to reset it. To proceed click the button below.
              </p>
              <Button variant="secondary" onClick={handlePasswordRecovery}>
                Reset
              </Button>
            </div>

            <div className="settings-side-card delete-account-wrapper">
              <p className="settings-side-eyebrow settings-side-eyebrow-danger">
                Danger zone
              </p>
              <h2 className="settings-side-title">Delete account</h2>
              <p className="settings-side-text">
                If you want to delete your account, click the button below.
              </p>
              <Button variant="delete" onClick={handleShowDeleteModal}>
                Delete account
              </Button>
            </div>
          </aside>

          <ConfirmationModal
            message=" You are about to delete your account. If you wish to proceed please
          click Delete button below."
            onDelete={handleDeleteAccount}
            showConfirmationModal={showDeleteConfirmModal}
            setShowConfirmationModal={setShowDeleteConfirmModal}
            isProcessing={isDeleting}
          />
        </div>
      </section>
    </>
  );
}
