import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { Job } from "../../types";

import { useAppSelector } from "../../store/hooks";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";

import { JobItem } from "../../components/job-components/job-item/JobItem";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loader/Loader";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { getApiErrorMessage } from "../../utils/apiError";

import "./UserSavedJobs.css";

export function UserSavedJobsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadSavedJobs = useCallback(() => {
    const apiJobService = new ApiService(API_URL);

    if (user) {
      setLoading(true);
      setError(null);
      apiJobService.getAllJobs()
        .then((response) => {
          const allJobs: Job[] = response.data;
          const userSavedJobs = allJobs.filter((job) =>
            (user.savedJobs ?? []).includes(String(job._id ?? job.id)),
          );
          setSavedJobs(userSavedJobs);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
          setError(getApiErrorMessage(error));
          setLoading(false);
        });
    } else {
      setSavedJobs([]);
      setError(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleRedirectToJobs = () => {
    navigate("/jobs");
  };

  return (
    <>
      <section className="user-saved-jobs-container">
        <div className="user-saved-jobs-wrapper">
          <header className="saved-jobs-header">
            <div className="saved-jobs-header-copy">
              <p className="saved-jobs-eyebrow">אזור אישי</p>
              <h1 className="saved-jobs-title">משרות שמורות</h1>
              <p className="saved-jobs-subtitle">
                שמור על משרות שמעניינות אותך וחזור אליהן בכל זמן כשתהיה מוכן
                להגיש מועמדות.
              </p>
            </div>
            <div className="saved-jobs-summary">
              <span className="saved-jobs-summary-number">
                {savedJobs.length}
              </span>
              <span className="saved-jobs-summary-label">משרות שמורות</span>
            </div>
          </header>

          {loading ? (
            <div className="saved-jobs-loading-state">
              <Loader
                className="saved-jobs-loader"
                label="Loading saved jobs..."
                variant="compact"
              />
              <p>טוען משרות שמורות...</p>
            </div>
          ) : error ? (
            <ErrorMessage
              className="saved-jobs-error-state"
              message={error}
              onRetry={loadSavedJobs}
            />
          ) : (
            <div className="saved-jobs-grid">
              {savedJobs.length > 0 ? (
                savedJobs.map((job) => (
                  <article
                    className="saved-jobs-item-wrapper"
                    key={job._id ?? job.id}>
                    <JobItem
                      jobTitle={job.jobTitle}
                      area={job.area}
                      domain={job.domain}
                      profession={job.profession}
                      scope={job.scope}
                      id={job._id ?? job.id}
                    />
                  </article>
                ))
              ) : (
                <div className="no-saved-jobs-message">
                  <div className="no-saved-jobs-icon">
                    <i className="fa-regular fa-bookmark"></i>
                  </div>
                  <h2 className="no-saved-jobs-title">אין משרות שמורות.</h2>
                  <p className="no-saved-jobs-text">
                    עיין במשרות החדשות ושמור את אלו שתרצה לחזור אליהן מאוחר
                    יותר.
                  </p>
                  <Button variant="jobs" onClick={handleRedirectToJobs}>
                    גלה משרות חדשות
                    <i className="fa-solid fa-arrow-left discover-jobs-arrow"></i>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
