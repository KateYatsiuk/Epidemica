import { Tag } from "@chakra-ui/react";
import { SimulationHistory } from "../../models/simulation";

export const hostoryColumns = [
  {
    key: "model", header: "Модель", render: (sim: SimulationHistory) => (
      <Tag.Root colorPalette="purple" size="xl" >
        <Tag.Label>{sim.model.toUpperCase()} </Tag.Label>
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
  { key: "r0", header: "Базове репродуктивне число R0", render: (sim: SimulationHistory) => sim.r0 },
];
