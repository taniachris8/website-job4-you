import { useState, useEffect } from "react";
import "./LatestJobs.css";
import type { Job } from "../../types";
import { JobItem } from "./JobItem";
import { useNavigate } from "react-router-dom";
import { Button } from "../buttons/Button";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import { Loader } from "../Loader";

export function LatestJobs() {
  const ApiAllJobs = new ApiService(API_URL);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/jobs");
  };

  useEffect(() => {
    ApiAllJobs.getAllJobs()
      .then((response) => {
        console.log("API Response:", response);
        if (response.data) {
          const latestJobs = response.data.slice(-6).reverse();
          setJobs(latestJobs);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.message) setError("Error fetching jobs");
      });
  }, []);

  return (
    <>
      {loading && <Loader />}
      <section className="latest-job-container">
        <h1 className="latest-job-title">רשימת משרות אחרונה</h1>
        <p className="latest-job-prg">
          דע את הערך שלך ומצא את העבודה שמזכה את חייך
        </p>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="job-items-container">
            {jobs.map((job) => (
              <div className="item-wrapper" key={job.id}>
                <JobItem
                  jobTitle={job.jobTitle}
                  area={job.area}
                  domain={job.domain}
                  profession={job.profession}
                  scope={job.scope}
                  id={job.id}
                />
              </div>
            ))}
          </div>
        )}

        <Button variant="jobs" onClick={handleClick}>
          לכל המשרות
          <i className="fa-solid fa-arrow-left arrow-style"></i>
        </Button>
      </section>
    </>
  );
}
