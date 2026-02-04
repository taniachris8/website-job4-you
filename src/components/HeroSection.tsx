import { useContext, useEffect } from "react";
import "../App.css";
import "./components-css/HeroSection.css";
import { FilterFreeSearch } from "./FilterJobs/FilterFreeSearch";
import { CustomTooltip } from "./CustomTooltip";
import { useNavigate } from "react-router-dom";
import { FilterContext } from "../services/FilterContext";

export function HeroSection() {
  const { setSearchTerm } = useContext(FilterContext);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  const handleRedirectToAllJobs = () => {
    navigate(`/jobs`);
  };

  return (
    <>
      <section className="hero-container">
        <h1 className="hero-cnt-title">JOB4YOU השמה ויעוץ כח אדם</h1>
        <p className="hero-cnt-prg">הדרך המהירה והמקצועית למעסיק הנכון</p>
        <div className="hero-input-container">
          <FilterFreeSearch className="filter-free-search-style" />
          <CustomTooltip message="Advanced search" placement="bottom">
            <button
              className="slider-icon-btn"
              onClick={handleRedirectToAllJobs}>
              <i className="fa-solid fa-sliders slider-icon"></i>
            </button>
          </CustomTooltip>
        </div>
      </section>
    </>
  );
}
