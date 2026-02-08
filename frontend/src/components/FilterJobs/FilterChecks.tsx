import Form from "react-bootstrap/Form";
import "./filterJobsCSS/FilterChecks.css";

interface FilterChecksProps {
  filterSearch?: string;
  filterLabels?: string[];
  selectedFilters?: string[];
  onFilterChange: (label: string) => void;
}

export function FilterChecks({
  filterSearch = "",
  filterLabels = [],
  selectedFilters = [],
  onFilterChange,
}: FilterChecksProps) {
  const filteredLabels = filterLabels.filter((label) =>
    label.toLowerCase().includes(filterSearch.toLowerCase()),
  );

  return (
    <>
      <div className="filter-checks-container">
        <Form>
          {filteredLabels.map((label, index) => (
            <Form.Check
              key={index}
              reverse
              label={label}
              name="group1"
              type="checkbox"
              id={`reverse-checkbox-${index}`}
              checked={selectedFilters.includes(label)}
              onChange={() => onFilterChange(label)}
            />
          ))}
        </Form>
      </div>
    </>
  );
}
