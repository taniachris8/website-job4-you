import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./JobPage.css";
import { ApplyForm } from "../../components/ApplyForm";
import { useAuth } from "../../services/useAuthHook";
import { Button } from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import type { Job } from "../../types";

export function JobPage() {
  const Api = new ApiService(API_URL);
  const params = useParams();
  const id = params.id as string | undefined;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleCloseModal = () => setShowApplyForm(false);
  const handleShowModal = () => setShowApplyForm(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    Api.getJobById(id)
      .then((response) => {
        if (response.data) {
          setJob(response.data as Job);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (user && job) {
      const savedJobs = Array.isArray(user.savedJobs) ? user.savedJobs : [];
      setIsSaved(savedJobs.includes(String(id ?? "")));
    }
  }, [user, job, id]);

  // Fetch user saved jobs only if a user is logged in
  useEffect(() => {
    if (user && user._id) {
      Api.getUserById(user._id)
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

    // Log updated saved jobs to debug
    console.log("Updated saved jobs:", updatedSavedJobs);

    // Update the user's saved jobs
    console.log("user", user);
    if (user._id) {
      Api.updateUser(user._id, { ...user, savedJobs: updatedSavedJobs })
        .then((response) => {
          console.log("User updated:", response.data);
          setIsSaved(!isSaved);
          setUser({ ...user, savedJobs: updatedSavedJobs });
        })
        .catch((error) => {
          console.error("Error saving job:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>No job found</div>;
  }

  const renderTextAsListItems = (text?: string) => {
    return (text ?? "")
      .split("\n")
      .map((str, index) => <li key={index}>{str}</li>);
  };

  return (
    <>
      <section className="job-page-container">
        <h1 className="job-page-title">{job.jobTitle}</h1>
        <div className="job-page-content-wrapper">
          <div className="job-page-description-wrapper">
            <div className="job-page-description">
              <h1 className="description-title">תיאור</h1>
              <ul>{renderTextAsListItems(job.jobDescription)}</ul>
            </div>
            <div className="job-page-requirements">
              <h3 className="description-title">דרישות</h3>
              <ul>{renderTextAsListItems(job.jobRequirements)}</ul>
            </div>
            <div className="job-page-btns">
              <Button variant="primary" onClick={handleShowModal}>
                הגשת מועמדות
              </Button>
              <button
                className={`wishlist-btn ${isSaved ? "saved" : ""}`}
                onClick={handleSaveJob}>
                <i
                  className={`fa-${isSaved ? "solid" : "regular"} fa-heart`}></i>
                {isSaved ? " הוסר מהמועדפים" : " הוספה למועדפים"}
              </button>
              <ApplyForm
                showApplyForm={showApplyForm}
                onHide={handleCloseModal}
                handleCloseModal={handleCloseModal}
              />
            </div>
          </div>
          <div className="job-page-details">
            <div className="job-page-detail">
              <div className="detail-and-icon">
                <i className="fa-solid fa-suitcase details-icon"></i>
                <h1 className="detail-title">תחום:</h1>
              </div>
              <p>{job.domain}</p>
            </div>
            <div className="job-page-detail">
              <div className="detail-and-icon">
                <i className="fa-regular fa-address-card details-icon"></i>
                <h1 className="detail-title">מקצוע:</h1>
              </div>
              <p>{job.profession}</p>
            </div>
            <div className="job-page-detail">
              <div className="detail-and-icon">
                <i className="fa-solid fa-location-pin details-icon"></i>
                <h1 className="detail-title">איזור:</h1>
              </div>
              <p>{job.area}</p>
            </div>
            <div className="job-page-detail">
              <div className="detail-and-icon">
                <i className="fa-solid fa-clock details-icon"></i>
                <h1 className="detail-title">היקף משרה:</h1>
              </div>
              <p>{job.scope}</p>
            </div>
            <div className="job-page-detail">
              <div className="detail-and-icon">
                <i className="fa-solid fa-tag details-icon"></i>
                <h1 className="detail-title"> מס’ משרה:</h1>
              </div>
              <p>{job.jobNumber}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
