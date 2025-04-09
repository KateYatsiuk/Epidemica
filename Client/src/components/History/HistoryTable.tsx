import { Checkbox, Tag, HStack, IconButton, Table, Box, CheckboxCheckedChangeDetails } from "@chakra-ui/react";
import { LuFileChartColumn, LuTrash2 } from "react-icons/lu";
import { SimulationHistory } from "../../models/simulation";
import { useNavigate } from "react-router-dom";
import { ConfirmDeleteDialog } from "../core/ConfirmDeleteDialog";

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

  const columns = [
    {
      key: "model", header: "Модель", render: (sim: SimulationHistory) => (
        <Tag.Root colorPalette="purple" size="xl">
          <Tag.Label>{sim.model.toUpperCase()}</Tag.Label>
        </Tag.Root>
      ),
    },
    {
      key: "created_at", header: "Дата", render: (sim: SimulationHistory) =>
        `${new Date(sim.created_at).toLocaleDateString("uk-UA")}
        ${new Date(sim.created_at).toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`
    },
    { key: "days", header: "Днів", render: (sim: SimulationHistory) => sim.days },
    { key: "max_infected", header: "Пік інфікованих", render: (sim: SimulationHistory) => sim.max_infected.toFixed(2) },
    { key: "peak_day", header: "День піку", render: (sim: SimulationHistory) => sim.peak_day },
  ];

  return (
    <Box w="full" overflowX="auto" borderWidth="1px" borderRadius="lg">
      <Table.Root variant="line" colorScheme="gray" fontSize="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Checkbox.Root
                colorPalette="purple"
                checked={selectedIds.length === items.length}
                onCheckedChange={selectAll}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            {columns.map(col => (
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
                  checked={selectedIds.includes(sim.id)}
                  onCheckedChange={() => onToggleSelect(sim.id)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              {columns.map(col => (
                <Table.Cell key={col.key}>{col.render(sim)}</Table.Cell>
              ))}
              <Table.Cell>
                <HStack gap={2}>
                  <IconButton
                    colorPalette="purple"
                    aria-label="Переглянути"
                    variant="ghost"
                    onClick={() => navigate(`/simulation/${sim.id}`)}
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
