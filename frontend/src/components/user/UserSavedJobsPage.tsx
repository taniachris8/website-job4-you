import { useState, useEffect } from "react";
import "./UserSavedJobs.css";
import { useAuth } from "../../services/AuthContext";
import { JobItem } from "../jobComponents/JobItem";
import { Button } from "../buttons/Button";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import type { Job } from "../../types";

export function UserSavedJobsPage() {
  const ApiJobService = new ApiService(API_URL);
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      ApiJobService.getAllJobs()
        .then((response) => {
          const allJobs: Job[] = response.data;
          const userSavedJobs = allJobs.filter((job) =>
            (user.savedJobs ?? []).includes(String(job._id ?? job.id)),
          );
          setSavedJobs(userSavedJobs);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
        });
    }
  }, [user]);

  const handleRedirectToJobs = () => {
    navigate("/jobs");
  };

  return (
    <>
      <div className="user-saved-jobs-container">
        <div className="user-saved-jobs-wrapper">
          <h1 className="saved-jobs-title">Saved jobs</h1>
          <div className="saved-jobs-grid">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div
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
                </div>
              ))
            ) : (
              <div className="no-saved-jobs-message">
                <p>There are no saved jobs.</p>
                <Button variant="jobs" onClick={handleRedirectToJobs}>
                  Discover job offers
                  <i className="fa-solid fa-arrow-left discover-jobs-arrow"></i>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
