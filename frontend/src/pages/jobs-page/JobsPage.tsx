import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import type { Job } from "../../types";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  applyFilters,
  clearAllFilters,
  fetchJobs,
  setAreaFilters,
} from "../../store/slices/filtersSlice";

import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";

import { FilterSidebar } from "../../components/filter-jobs/filter-sidebar/FilterSidebar";
import { JobItem } from "../../components/job-components/job-item/JobItem";
import { AddNewJob } from "../../components/admin/add-new-job/AddNewJob";
import { CustomPagination } from "../../components/custom-pagination/CustomPagination";
import { FilterFreeSearch } from "../../components/filter-jobs/filter-free-search/FilterFreeSearch";
import { Button } from "../../components/button/Button";

import { Loader } from "../../components/loader/Loader";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { getApiErrorMessage } from "../../utils/apiError";

import "./JobsPage.css";

export function JobsPage() {
  const apiJobService = new ApiService(API_URL);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const filteredJobs = useAppSelector((state) => state.filters.filteredJobs);
  const filtersStatus = useAppSelector((state) => state.filters.status);
  const filtersError = useAppSelector((state) => state.filters.error);
  const [showAddNewJob, setShowAddNewJob] = useState(false);
  const [jobActionError, setJobActionError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const itemsPerPage = 10;
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const handleCloseAddJobModal = () => setShowAddNewJob(false);
  const handleShowAddJobModal = () => setShowAddNewJob(true);

  const refreshJobs = useCallback(async () => {
    setJobActionError(null);
    await dispatch(fetchJobs()).unwrap();
  }, [dispatch]);

  const handleDeleteJob = (_id: string | number) => {
    setJobActionError(null);
    apiJobService
      .deleteJob(_id)
      .then(() => refreshJobs())
      .catch((error) => {
        console.error("Error deleting job:", error);
        setJobActionError(
          getApiErrorMessage(error, {
            defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05DE\u05E9\u05E8\u05D4. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
          }),
        );
      });
  };

  const handleEditJob = (_id: string | number, updatedJob: Partial<Job>) => {
    setJobActionError(null);
    apiJobService
      .updateJob(_id, updatedJob)
      .then(() => refreshJobs())
      .catch((error) => {
        console.error("Error updating job:", error);
        setJobActionError(
          getApiErrorMessage(error, {
            defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05EA \u05D4\u05DE\u05E9\u05E8\u05D4. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
          }),
        );
      });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    refreshJobs().catch((error) => {
      console.error("Failed to load jobs:", error);
    });
  }, [refreshJobs]);

  useEffect(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  useEffect(() => {
    setCurrentJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage, indexOfFirstJob, indexOfLastJob]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");

    if (filter) {
      try {
        const parsedFilter = JSON.parse(decodeURIComponent(filter));
        dispatch(setAreaFilters(parsedFilter));
      } catch (error) {
        console.error("Failed to parse filter from URL:", error);
      }
    }

    if (location.state && location.state.applyFilters) {
      dispatch(applyFilters());
    }
  }, [location.search, location.state, dispatch]);

  return (
    <>
      {filtersStatus === "loading" && (
        <Loader className="jobs-page-loader" label="טוען משרות..." showLabel />
      )}
      {filtersError && filtersStatus !== "loading" ? (
        <section className="jobs-container">
          <div className="jobs-wrapper">
            <ErrorMessage
              message={filtersError}
              onRetry={() => {
                refreshJobs().catch((error) => {
                  console.error("Failed to load jobs:", error);
                });
              }}
            />
          </div>
        </section>
      ) : (
        <section className="jobs-container">
          <div className="jobs-wrapper">
            <header className="jobs-page-header">
              <div className="jobs-page-heading">
                <h1 className="jobs-page-title">דרושים</h1>
                {/* <p className="jobs-page-count">{filteredJobs.length}</p> */}
              </div>
              <div className="jobs-search-panel">
                <FilterFreeSearch className="jobs-input" />
              </div>
            </header>

            <div className="jobs-and-filter-block">
              <aside className="job-filter" aria-label="Job filters">
                <FilterSidebar />
              </aside>

                <div className="jobs-main-column">
                {jobActionError ? (
                  <ErrorMessage
                    className="jobs-action-error"
                    message={jobActionError}
                    compact
                  />
                ) : null}

                <div className="jobs-results-bar">
                  <div className="jobs-results-count">
                    <span className="jobs-results-number">{filteredJobs.length}</span>
                    <span className="jobs-results-label">משרות</span>
                  </div>

                  {user && user.role === "admin" && (
                    <div className="jobs-admin-actions">
                      <Button
                        className="add-new-job-btn"
                        variant="secondary"
                        onClick={handleShowAddJobModal}>
                        <i className="fa-solid fa-plus add-new-job-icon"></i>
                        <span>הוסף עבודה חדשה</span>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="job-items-wrapper">
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => {
                      const jobId = job.id ?? job._id;
                      return (
                        <article
                          className="job-item"
                          key={jobId ?? job.jobNumber}>
                          <JobItem
                            jobTitle={job.jobTitle}
                            area={job.area}
                            domain={job.domain}
                            profession={job.profession}
                            scope={job.scope}
                            id={jobId}
                            jobNumber={job.jobNumber}
                            jobDescription={job.jobDescription}
                            jobRequirements={job.jobRequirements}
                            onDelete={() =>
                              handleDeleteJob(String(jobId ?? job.id ?? ""))
                            }
                            onEdit={(updatedJob) =>
                              handleEditJob(
                                String(jobId ?? job.id ?? ""),
                                updatedJob,
                              )
                            }
                          />
                        </article>
                      );
                    })
                  ) : (
                    <div className="jobs-empty-state">
                      {"\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E9\u05E8\u05D5\u05EA \u05DC\u05D4\u05E6\u05D2\u05D4."}
                    </div>
                  )}
                </div>

                <div className="jobs-pagination">
                  <CustomPagination
                    totalItems={filteredJobs.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>

              <AddNewJob
                showAddNewJob={showAddNewJob}
                onHide={handleCloseAddJobModal}
                fetchJobs={refreshJobs}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
