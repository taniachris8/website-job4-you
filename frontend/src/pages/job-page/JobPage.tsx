import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";

import { mergeUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { ApplyForm } from "../../components/apply-form/ApplyForm";
import { Button } from "../../components/button/Button";
import type { Job } from "../../types";
import { Loader } from "../../components/loader/Loader";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { getApiErrorMessage, apiErrorMessages } from "../../utils/apiError";

import "./JobPage.css";

export function JobPage() {
  const params = useParams();
  const id = params.id as string | undefined;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowApplyForm(false);
  const handleShowModal = () => {
    setShowApplySuccess(false);
    setShowApplyForm(true);
  };

  const loadJob = useCallback(() => {
    if (!id) {
      setJob(null);
      setError(apiErrorMessages.notFound);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const api = new ApiService(API_URL);

    api.getJobById(id)
      .then((response) => {
        if (response.data) {
          setJob(response.data as Job);
        } else {
          setJob(null);
          setError(apiErrorMessages.notFound);
        }
      })
      .catch((err) => {
        console.error("Error fetching job:", err);
        setJob(null);
        setError(getApiErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  useEffect(() => {
    if (user && job) {
      const savedJobs = Array.isArray(user.savedJobs) ? user.savedJobs : [];
      setIsSaved(savedJobs.includes(String(id ?? "")));
    }
  }, [user, job, id]);

  useEffect(() => {
    const userId = user?.id ?? user?._id;
    if (user && userId) {
      const api = new ApiService(API_URL);

      api.getUserById(userId)
        .then((response) => {
          const savedJobs = Array.isArray(response.data?.savedJobs)
            ? response.data.savedJobs
            : [];
          if (savedJobs.includes(String(id ?? ""))) {
            setIsSaved(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [user, id]);

  const handleSaveJob = () => {
    setSaveError(null);

    if (!user) {
      navigate("/login");
      return;
    }

    const currentSavedJobs: string[] = Array.isArray(user.savedJobs)
      ? (user.savedJobs as string[])
      : [];

    const updatedSavedJobs = isSaved
      ? currentSavedJobs.filter((jobId) => jobId !== String(id))
      : [...currentSavedJobs, String(id)];

    const userId = user?.id ?? user?._id;
    if (userId) {
      const api = new ApiService(API_URL);

      api.updateUser(userId, { savedJobs: updatedSavedJobs })
        .then(() => {
          setIsSaved(!isSaved);
          dispatch(mergeUser({ ...user, savedJobs: updatedSavedJobs }));
        })
        .catch((error) => {
          console.error("Error saving job:", error);
          setSaveError(
            getApiErrorMessage(error, {
              defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05DE\u05D5\u05E2\u05D3\u05E4\u05D9\u05DD. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
            }),
          );
        });
    }
  };

  const renderTextAsListItems = (text?: string) => {
    return (text ?? "")
      .split("\n")
      .map((str, index) => <li key={index}>{str}</li>);
  };

  return (
    <>
      <section className="job-page-container">
        {loading ? (
          <Loader className="job-page-loader" label="טוען משרה..." showLabel />
        ) : error ? (
          <ErrorMessage
            className="job-page-error"
            message={error}
            onRetry={loadJob}
          />
        ) : job ? (
          <div className="job-page-shell">
            <header className="job-page-hero">
              <div>
                <div className="job-page-hero-main">
                  <p className="job-page-eyebrow">משרה פתוחה</p>
                  <h1 className="job-page-title">{job.jobTitle}</h1>
                  <div className="job-page-meta-grid">
                    <div className="job-page-meta-chip">
                      <i className="fa-solid fa-suitcase details-icon"></i>
                      <span>{job.domain}</span>
                    </div>
                    <div className="job-page-meta-chip">
                      <i className="fa-regular fa-address-card details-icon"></i>
                      <span>{job.profession}</span>
                    </div>
                    <div className="job-page-meta-chip">
                      <i className="fa-solid fa-location-pin details-icon"></i>
                      <span>{job.area}</span>
                    </div>
                    <div className="job-page-meta-chip">
                      <i className="fa-solid fa-clock details-icon"></i>
                      <span>{job.scope}</span>
                    </div>
                  </div>
                </div>

                <div className="job-page-content-wrapper">
                  <section className="job-page-section job-page-description">
                    <h2 className="description-title">תיאור</h2>
                    <ul>{renderTextAsListItems(job.jobDescription)}</ul>
                  </section>

                  <section className="job-page-section job-page-requirements">
                    <h2 className="description-title">דרישות</h2>
                    <ul>{renderTextAsListItems(job.jobRequirements)}</ul>
                  </section>
                </div>
              </div>

              <aside className="job-page-summary-card">
                <div className="job-page-summary-list">
                  <div className="job-page-detail">
                    <span className="detail-title">תחום</span>
                    <p>{job.domain}</p>
                  </div>
                  <div className="job-page-detail">
                    <span className="detail-title">מקצוע</span>
                    <p>{job.profession}</p>
                  </div>
                  <div className="job-page-detail">
                    <span className="detail-title">איזור</span>
                    <p>{job.area}</p>
                  </div>
                  <div className="job-page-detail">
                    <span className="detail-title">היקף משרה</span>
                    <p>{job.scope}</p>
                  </div>
                  <div className="job-page-detail">
                    <span className="detail-title">מס’ משרה</span>
                    <p>{job.jobNumber}</p>
                  </div>
                </div>

                <div className="job-page-btns">
                  {showApplySuccess ? (
                    <Alert
                      variant="success"
                      dismissible
                      onClose={() => setShowApplySuccess(false)}
                      className="job-page-submit-alert">
                      הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.
                    </Alert>
                  ) : null}
                  {saveError ? (
                    <ErrorMessage message={saveError} compact />
                  ) : null}

                  {user?.role !== "admin" && (
                    <Button variant="primary" onClick={handleShowModal}>
                      הגשת מועמדות
                    </Button>
                  )}

                  <button
                    type="button"
                    className={`wishlist-btn ${isSaved ? "saved" : ""}`}
                    aria-pressed={isSaved}
                    onClick={handleSaveJob}>
                    <i
                      className={`fa-${isSaved ? "solid" : "regular"} fa-heart`}></i>
                    {isSaved ? " הוסר מהמועדפים" : " הוספה למועדפים"}
                  </button>
                </div>
              </aside>
            </header>

            <ApplyForm
              showApplyForm={showApplyForm}
              onHide={handleCloseModal}
              onSuccess={() => setShowApplySuccess(true)}
            />
          </div>
        ) : (
          <div className="job-page-empty-state">
            {"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05DE\u05E9\u05E8\u05D4 \u05DC\u05D4\u05E6\u05D2\u05D4."}
          </div>
        )}
      </section>
    </>
  );
}
