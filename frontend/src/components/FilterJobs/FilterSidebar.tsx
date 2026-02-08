import { useContext } from "react";
import "./filterJobsCSS/FilterSidebar.css";
import { FilterCard } from "./FilterCard";
import { SmallTip } from "../tips/SmallTip";
import { FilterContext } from "../../services/FilterContext";
import { domainOptions } from "../options/DomainOptions";
import { professionOptions } from "../options/ProfessionOptions";
import { areaOptions } from "../options/AreaOptions";
import { scopeOptions } from "../options/ScopeOptions";

export function FilterSidebar() {
  const { selectedFilters, setSelectedFilters } = useContext(FilterContext);

  const handleFilterChange = (
    category: "domain" | "profession" | "area" | "scope",
    value: string,
  ) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(
          (filter) => filter !== value,
        );
      } else {
        newFilters[category].push(value);
      }
      return newFilters;
    });
  };

  console.log("Selected Filters:", selectedFilters);

  return (
    <>
      <div className="sidebar-container">
        <div className="filters-wrapper">
          <div className="filter">
            <FilterCard
              header="תחום"
              filterLabels={domainOptions}
              selectedFilters={selectedFilters.domain}
              onFilterChange={(value) => handleFilterChange("domain", value)}
            />
          </div>
          <div className="filter">
            <FilterCard
              header="מקצוע"
              filterLabels={professionOptions}
              selectedFilters={selectedFilters.profession}
              onFilterChange={(value) =>
                handleFilterChange("profession", value)
              }
            />
          </div>
          <div className="filter">
            <FilterCard
              header="אזור"
              filterLabels={areaOptions}
              selectedFilters={selectedFilters.area}
              onFilterChange={(value) => handleFilterChange("area", value)}
            />
          </div>
          <div className="filter">
            <FilterCard
              header="היקף משרה"
              filterLabels={scopeOptions}
              selectedFilters={selectedFilters.scope}
              onFilterChange={(value) => handleFilterChange("scope", value)}
            />
          </div>
        </div>
        <div className="recommended-articles-wrapper">
          <h2 className="recommended-art">מאמרים מומלצים</h2>
          <div className="tip-filter-wrapper">
            <SmallTip
              path="/"
              image="images/image3.jpg"
              title="טיפים לראיון עבודה"
              date="27.05.2024"
            />
          </div>

          <div className="tip-filter-wrapper">
            <SmallTip
              path="/"
              image="images/image7.jpg"
              title="טיפים לראיון עבודה"
              date="27.05.2024"
            />
          </div>
          <div className="tip-filter-wrapper">
            <SmallTip
              path="/"
              image="images/happy2.jpg"
              title="טיפים לראיון עבודה"
              date="27.05.2024"
            />
          </div>
        </div>
      </div>
    </>
  );
}
