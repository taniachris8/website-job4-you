import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  clearAllFilters,
  toggleFilter,
} from "../../../store/slices/filtersSlice";

import { domainOptions } from "../../../consts/options/DomainOptions";
import { professionOptions } from "../../../consts/options/ProfessionOptions";
import { areaOptions } from "../../../consts/options/AreaOptions";
import { scopeOptions } from "../../../consts/options/ScopeOptions";

import { FilterCard } from "../filter-card/FilterCard";
import { SmallTip } from "../../tips/small-tip/SmallTip";
import { smallTips } from "../../../consts/smallTips";

import "./FilterSidebar.css";

export function FilterSidebar() {
  const dispatch = useAppDispatch();
  const selectedFilters = useAppSelector(
    (state) => state.filters.selectedFilters,
  );

  const handleFilterChange = (
    category: "domain" | "profession" | "area" | "scope",
    value: string,
  ) => {
    dispatch(toggleFilter({ category, value }));
  };

  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };

  return (
    <>
      <div className="sidebar-container">
        <button onClick={handleClearAllFilters} className="clear-filters-btn">
          נקה את כל המסננים
        </button>
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
          {smallTips.map((tip, index) => (
            <SmallTip
              key={index}
              path={tip.path}
              image={tip.image}
              title={tip.title}
              date={tip.date}
            />
          ))}
        </div>
      </div>
    </>
  );
}