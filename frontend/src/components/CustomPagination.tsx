import Pagination from "react-bootstrap/Pagination";
import "./components-css/CustomPagination.css";

interface CustomPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export function CustomPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handleClick(number)}
        linkClassName="pagination-link">
        {number}
      </Pagination.Item>,
    );
  }

  return <Pagination>{items}</Pagination>;
}
