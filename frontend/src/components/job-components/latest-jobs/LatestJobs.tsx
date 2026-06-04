import { useCallback, useState, useEffect } from "react";

import type { Job } from "../../../types";
import { JobItem } from "../job-item/JobItem";
import { useNavigate } from "react-router-dom";
import { Button } from "../../button/Button";
import { ApiService } from "../../../services/ApiService";
import { API_URL } from "../../../consts/general";
import { Loader } from "../../loader/Loader";
import { ErrorMessage } from "../../error-message/ErrorMessage";
import { getApiErrorMessage } from "../../../utils/apiError";

import "./LatestJobs.css";

export function LatestJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/jobs");
  };

  const loadLatestJobs = useCallback(() => {
    const apiAllJobs = new ApiService(API_URL);
    setLoading(true);
    setError(null);

    apiAllJobs.getAllJobs()
      .then((response) => {
        console.log("API Response:", response);
        if (response.data) {
          const latestJobs = response.data.slice(0, 6);
          setJobs(latestJobs);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
        setError(getApiErrorMessage(error));
      });
  }, []);

  useEffect(() => {
    loadLatestJobs();
  }, [loadLatestJobs]);

  return (
    <>
      <section className="latest-job-container">
        <div className="latest-job-header">
          <h1 className="latest-job-title">רשימת משרות אחרונה</h1>
          <p className="latest-job-prg">
            דע את הערך שלך ומצא את העבודה שמזכה את חייך
          </p>
        </div>
        {loading ? (
          <Loader className="latest-jobs-loader" variant="inline" />
        ) : error ? (
          <ErrorMessage
            className="latest-jobs-error"
            message={error}
            onRetry={loadLatestJobs}
          />
        ) : (
          <div className="job-items-container">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <article className="item-wrapper" key={job.id}>
                  <JobItem
                    jobTitle={job.jobTitle.length < 19 ? job.jobTitle : `${job.jobTitle.substring(0, 19)}...`}
                    area={job.area}
                    domain={job.domain}
                    profession={job.profession}
                    scope={job.scope}
                    id={job.id}
                  />
                </article>
              ))
            ) : (
              <div className="latest-jobs-empty-state">
                {"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E9\u05E8\u05D5\u05EA \u05DC\u05D4\u05E6\u05D2\u05D4."}
              </div>
            )}
          </div>
        )}

        <div className="latest-job-actions">
          <Button variant="jobs" onClick={handleClick}>
            לכל המשרות
            <i className="fa-solid fa-arrow-left arrow-style"></i>
          </Button>
        </div>
      </section>
    </>
  );
}
