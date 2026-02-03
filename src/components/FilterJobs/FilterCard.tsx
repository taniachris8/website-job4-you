import { useState } from "react";
import "./filterJobsCSS/FilterCard.css";
import Accordion from "react-bootstrap/Accordion";
import { SearchBar } from "../SearchBar";
import { FilterChecks } from "./FilterChecks";

interface FilterCardProps {
  header: string;
  filterLabels?: string[];
  selectedFilters?: string[];
  onFilterChange: (value: string) => void;
}

export function FilterCard({
  header,
  filterLabels,
  selectedFilters,
  onFilterChange,
}: FilterCardProps) {
  const [filterSearch, setFilterSearch] = useState("");

  return (
    <>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Accordion.Item eventKey="0" className="accordion-filter">
          <Accordion.Header bsPrefix="acc-header">{header}</Accordion.Header>
          <Accordion.Body>
            <SearchBar
              placeholder="חיפוש היקף משרה..."
              setFilterSearch={setFilterSearch}
            />
            <FilterChecks
              filterSearch={filterSearch}
              filterLabels={filterLabels}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
