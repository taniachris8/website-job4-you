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
              <p className="saved-jobs-eyebrow">Personal area</p>
              <h1 className="saved-jobs-title">Saved jobs</h1>
              <p className="saved-jobs-subtitle">
                Keep track of the opportunities that caught your attention and
                return to them whenever you are ready to apply.
              </p>
            </div>
            <div className="saved-jobs-summary">
              <span className="saved-jobs-summary-number">{savedJobs.length}</span>
              <span className="saved-jobs-summary-label">saved roles</span>
            </div>
          </header>

          {loading ? (
            <div className="saved-jobs-loading-state">
              <Loader
                className="saved-jobs-loader"
                label="Loading saved jobs..."
                variant="compact"
              />
              <p>Loading saved jobs...</p>
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
                  <h2 className="no-saved-jobs-title">There are no saved jobs.</h2>
                  <p className="no-saved-jobs-text">
                    Browse the latest roles and save the ones you want to revisit
                    later.
                  </p>
                  <Button variant="jobs" onClick={handleRedirectToJobs}>
                    Discover job offers
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
