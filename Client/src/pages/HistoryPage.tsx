import { useEffect, useState } from "react";
import {
  Button,
  HStack,
  VStack,
  Heading,
  Spinner,
  CheckboxCheckedChangeDetails,
  Box,
  useBreakpointValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/ApiProvider";
import { Tooltip } from "../components/ui/tooltip";
import { toaster } from "../components/ui/toaster";
import { SimulationHistory } from "../models/simulation";
import HistoryTable from "../components/History/HistoryTable";
import PaginationFooter from "../components/History/PaginationFooter";
import EmptyHistory from "../components/History/EmptyHistory";
import HistoryCardList from "../components/History/HistoryCardList";

const defaultPageSize = 10;

const HistoryPage = () => {
  const { api } = useApi();
  const [simulations, setSimulations] = useState<SimulationHistory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const res = await api.get("/history", {
          params: { page, page_size: defaultPageSize }
        });
        setSimulations(res.data.simulations);
        setTotal(res.data.total);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSimulations();
  }, [page]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/simulation/${id}`);
      setSimulations((prev) => prev.filter((sim) => sim.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toaster.success({
        title: "Симуляцію видалено",
        duration: 3000,
      });
    } catch {
      console.log("Delete error");
    }
  };

  const handleCompare = () => {
    navigate(`/compare?ids=${selectedIds.join(",")}`);
  };

  const handleCheckBox = (details: CheckboxCheckedChangeDetails) => {
    if (details.checked) {
      setSelectedIds(simulations.map((sim) => sim.id));
    } else {
      setSelectedIds([]);
    }
  };

  if (isLoading) return <Spinner size="xl" />;

  return (
    <VStack align="start" gap={2}>
      <Heading size="3xl" mb={4}>Історія симуляцій</Heading>

      <HStack mb={2}>
        <Tooltip content="Оберіть 2 або 3 симуляції для порівняння" showArrow>
          <Button
            size="sm"
            colorPalette="purple"
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || selectedIds.length > 3}
          >
            Порівняти вибрані ({selectedIds.length})
          </Button>
        </Tooltip>
      </HStack>

      {simulations.length > 0 ? (
        <>
          {isMobile ? (
            <HistoryCardList
              items={simulations}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onDelete={handleDelete}
            />
          ) : (
            <HistoryTable
              items={simulations}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              selectAll={handleCheckBox}
              onDelete={handleDelete}
            />
          )}
          <Box marginLeft="auto">
            <PaginationFooter
              page={page}
              pageSize={defaultPageSize}
              total={total}
              onPageChange={setPage}
            />
          </Box>
        </>
      ) : <EmptyHistory />
      }
    </VStack>
  );
};

export default HistoryPage;
