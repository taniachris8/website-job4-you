import { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

import { Button } from "../../button/Button";
import { CustomTooltip } from "../../custom-tooltip/CustomTooltip";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  applyFilters,
  setSearchTerm,
} from "../../../store/slices/filtersSlice";

import "./FilterFreeSearch.css";

export function FilterFreeSearch({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.filters.searchTerm);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSearch = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setShowTooltip(true);
      return;
    }

    setShowTooltip(false);
    dispatch(applyFilters());
    navigate("/jobs", { state: { applyFilters: true } });
  };

  const searchButton = (
    <Button
      variant="search"
      className="filter-search-button"
      onClick={handleSearch}>
      Search
    </Button>
  );

  return (
    <div className={`filter-search-bar ${className}`.trim()}>
      <div className="filter-search-bar-inner">
        <div className="filter-search-icon-block" aria-hidden="true">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <div className="filter-search-input-zone">
          <InputGroup className="filter-search-group">
            <Form.Control
              className="filter-search-input"
              type="text"
              placeholder="חיפוש חופשי"
              aria-label="חיפוש חופשי"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            {searchTerm ? (
              <button
                className="filter-search-clear"
                type="button"
                aria-label="Clear search"
                onClick={() => dispatch(setSearchTerm(""))}>
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            ) : null}
          </InputGroup>
        </div>

        <div className="filter-search-action-zone">
          {showTooltip ? (
            <CustomTooltip message="Please enter a search term" placement="bottom">
              {searchButton}
            </CustomTooltip>
          ) : (
            searchButton
          )}
        </div>
      </div>
    </div>
  );
}
