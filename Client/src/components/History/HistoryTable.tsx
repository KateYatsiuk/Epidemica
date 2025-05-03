import { Checkbox, HStack, IconButton, Table, Box, CheckboxCheckedChangeDetails } from "@chakra-ui/react";
import { LuFileChartColumn, LuTrash2 } from "react-icons/lu";
import { SimulationHistory } from "../../models/simulation";
import { useNavigate } from "react-router-dom";
import { ConfirmDeleteDialog } from "../core/ConfirmDeleteDialog";
import { historyColumns } from "./historyColumns";

interface HistoryTableProps {
  items: SimulationHistory[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  selectAll: (details: CheckboxCheckedChangeDetails) => void;
  onDelete: (id: string) => void;
}

const HistoryTable = ({
  items, selectedIds, onToggleSelect, selectAll, onDelete,
}: HistoryTableProps) => {
  const navigate = useNavigate();

  return (
    <Box w="full" overflowX="auto" borderWidth="1px" borderRadius="lg">
      <Table.Root variant="line" colorScheme="gray" fontSize="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Checkbox.Root
                colorPalette="purple"
                variant="subtle"
                checked={selectedIds.length === items.length}
                onCheckedChange={selectAll}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            {historyColumns.map(col => (
              <Table.ColumnHeader key={col.key}>{col.header}</Table.ColumnHeader>
            ))}
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((sim) => (
            <Table.Row key={sim.id}>
              <Table.Cell>
                <Checkbox.Root
                  colorPalette="purple"
                  variant="subtle"
                  checked={selectedIds.includes(sim.id)}
                  onCheckedChange={() => onToggleSelect(sim.id)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              {historyColumns.map(col => (
                <Table.Cell key={col.key}>{col.render(sim)}</Table.Cell>
              ))}
              <Table.Cell>
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default HistoryTable;
