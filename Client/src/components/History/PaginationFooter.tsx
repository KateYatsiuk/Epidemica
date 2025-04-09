import { IconButton, ButtonGroup } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationFooterProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}

const PaginationFooter = ({ page, pageSize, total, onPageChange }: PaginationFooterProps) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <ButtonGroup variant="ghost" size="lg" fontSize="lg">
      <IconButton
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Назад"
        colorPalette="purple"
      >
        <LuChevronLeft />
      </IconButton>

      {[...Array(totalPages)].map((_, idx) => (
        <IconButton
          key={idx}
          variant={page === idx + 1 ? "solid" : "ghost"}
          onClick={() => onPageChange(idx + 1)}
          colorPalette="purple"
        >
          {idx + 1}
        </IconButton>
      ))}

      <IconButton
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Вперед"
        colorPalette="purple"
      >
        <LuChevronRight />
      </IconButton>
    </ButtonGroup>
  );
};

export default PaginationFooter;
