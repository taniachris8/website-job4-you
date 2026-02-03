import { useState, useEffect, useContext } from "react";
import "./Jobs.css";
import { FilterSidebar } from "../../components/FilterJobs/FilterSidebar";
import { JobItem } from "../../components/jobComponents/JobItem";
import { AddNewJob } from "../../components/admin/AddNewJob";
import { useAuth } from "../../services/AuthContext";
import { CustomPagination } from "../../components/CustomPagination";
import { FilterContext } from "../../services/FilterContext";
import { useLocation } from "react-router-dom";
import { FilterFreeSearch } from "../../components/FilterJobs/FilterFreeSearch";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import type { Job } from "../../types";

export function JobsPage() {
  const ApiJobService = new ApiService(API_URL);
  const [showAddNewJob, setShowAddNewJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    searchTerm,
    selectedFilters,
    setSelectedFilters,
    applyFilters,
    filteredJobs,
    setFilteredJobs,
  } = useContext(FilterContext);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const handleCloseAddJobModal = () => setShowAddNewJob(false);
  const handleShowAddJobModal = () => setShowAddNewJob(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Clear the selected filters when Jobs page is rendered
    setSelectedFilters({ area: [], domain: [], profession: [], scope: [] });
  }, [setSelectedFilters]);

  useEffect(() => {
    console.log("filtered jobs", filteredJobs);
    setCurrentJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    if (filter) {
      try {
        const parsedFilter = JSON.parse(decodeURIComponent(filter));
        setSelectedFilters((prevFilters) => ({
          ...prevFilters,
          area: parsedFilter,
        }));
      } catch (error) {
        console.error("Failed to parse filter from URL:", error);
      }
    }

    // New: Check if the state contains applyFilters
    if (location.state && location.state.applyFilters) {
      applyFilters();
    }
  }, [location.search, location.state, setSelectedFilters]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedFilters]);

  const fetchJobs = async () => {
    try {
      const response = await ApiJobService.getAllJobs();
      const allJobs: Job[] = response.data;
      const reversedJobs = allJobs.slice().reverse();
      setJobs(allJobs);
      setFilteredJobs(reversedJobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const handleDeleteJob = (_id: string | number) => {
    ApiJobService.deleteJob(_id)
      .then((response) => {
        console.log("Job deleted:", response);
        alert("Job has been successfully deleted");
        fetchJobs();
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };

  const handleEditJob = (_id: string | number, updatedJob: Partial<Job>) => {
    ApiJobService.updateJob(_id, updatedJob)
      .then((response) => {
        console.log("Job updated:", response);
        fetchJobs();
      })
      .catch((error) => {
        console.error("Error updating job:", error);
      });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs available</div>;
  }

  return (
    <div className="jobs-container">
      <div className="jobs-wrapper">
        <FilterFreeSearch className="jobs-input" />
        <div className="jobs-and-filter-block">
          <div className="job-filter">
            <FilterSidebar />
          </div>
          <div className="job-items-wrapper">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div className="job-item" key={job._id}>
                  <JobItem
                    jobTitle={job.jobTitle}
                    area={job.area}
                    domain={job.domain}
                    profession={job.profession}
                    scope={job.scope}
                    id={job._id}
                    jobNumber={job.jobNumber}
                    jobDescription={job.jobDescription}
                    jobRequirements={job.jobRequirements}
                    onDelete={() =>
                      handleDeleteJob(String(job._id ?? job.id ?? ""))
                    }
                    onEdit={(updatedJob) =>
                      handleEditJob(String(job._id ?? job.id ?? ""), updatedJob)
                    }
                  />
                </div>
              ))
            ) : (
              <div>No jobs found</div>
            )}
            <CustomPagination
              totalItems={filteredJobs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          {user && user.role === "admin" && (
            <button className="add-new-job-btn" onClick={handleShowAddJobModal}>
              <i className="fa-solid fa-plus add-new-job-icon"></i>
              <p>הוסף עבודה חדשה</p>
            </button>
          )}
          <AddNewJob
            showAddNewJob={showAddNewJob}
            onHide={handleCloseAddJobModal}
            fetchJobs={fetchJobs}
          />
        </div>
      </div>
    </div>
  );
}
