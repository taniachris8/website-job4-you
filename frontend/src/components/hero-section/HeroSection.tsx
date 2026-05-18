import { useEffect } from "react";

import { useAppDispatch } from "../../store/hooks";
import { clearSearchTerm } from "../../store/slices/filtersSlice";

import { FilterFreeSearch } from "../filter-jobs/filter-free-search/FilterFreeSearch";

import "../../App.css";
import "./HeroSection.css";

export function HeroSection() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearSearchTerm());
  }, [dispatch]);

  return (
    <>
      <section className="hero-container">
        <div className="hero-content">
          <div className="hero-copy">
            <h1 className="hero-cnt-title">JOB4YOU השמה ויעוץ כח אדם</h1>
            <p className="hero-cnt-prg">הדרך המהירה והמקצועית למעסיק הנכון</p>
          </div>
          <div className="hero-input-container">
            <FilterFreeSearch className="filter-free-search-style" />
          </div>
        </div>
      </section>
    </>
  );
}
