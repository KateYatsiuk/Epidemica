import { Box, Checkbox, DataList, HStack, IconButton, Tag } from "@chakra-ui/react";
import { LuFileChartColumn, LuTrash2 } from "react-icons/lu";
import { SimulationHistory } from "../../models/simulation";
import { useNavigate } from "react-router-dom";
import { ConfirmDeleteDialog } from "../core/ConfirmDeleteDialog";
import { historyColumns } from "./historyColumns";

interface HistoryCardListProps {
  items: SimulationHistory[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const HistoryCardList = ({
  items,
  selectedIds,
  onToggleSelect,
  onDelete,
}: HistoryCardListProps) => {
  const navigate = useNavigate();

  return (
    <>
      {items.map((sim) => (
        <Box
          key={sim.id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          mb={4}
          shadow="sm"
          w="full"
          backgroundColor="colorPalette.contrast"
        >
          <HStack justify="space-between" mb={2}>
            <Checkbox.Root
              colorPalette="purple"
              variant="subtle"
              checked={selectedIds.includes(sim.id)}
              onCheckedChange={() => onToggleSelect(sim.id)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
            <HStack gap={2}>
              <IconButton
                colorPalette="purple"
                aria-label="Переглянути"
                variant="ghost"
                onClick={() => navigate(`/?id=${sim.id}`)}
              >
                <LuFileChartColumn />
              </IconButton>
              <ConfirmDeleteDialog
                onConfirm={() => onDelete(sim.id)}
              >
                <IconButton
                  colorPalette="red"
                  aria-label="Видалити"
                  variant="ghost"
                >
                  <LuTrash2 />
                </IconButton>
              </ConfirmDeleteDialog>
            </HStack>
          </HStack>
          <DataList.Root orientation="horizontal" divideY="1px" maxW="md">
            {historyColumns.map((col) => (
              <DataList.Item key={col.key}>
                <DataList.ItemLabel>{col.header}</DataList.ItemLabel>
                <DataList.ItemValue>{col.render(sim)}</DataList.ItemValue>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Box>
      ))}
    </>
  );
};

export default HistoryCardList;
