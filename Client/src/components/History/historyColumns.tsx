import { Tag } from "@chakra-ui/react";
import { getLabelByKey, SimulationHistory } from "../../models/simulation";

export const historyColumns = [
  {
    key: "model", header: "Модель", render: (sim: SimulationHistory) => (
      <Tag.Root colorPalette="purple" size="xl" >
        <Tag.Label>{sim.model.toUpperCase()} </Tag.Label>
      </Tag.Root>
    ),
  },
  {
    key: "created_at", header: getLabelByKey("created_at"), render: (sim: SimulationHistory) =>
      `${new Date(sim.created_at).toLocaleDateString("uk-UA")}
        ${new Date(sim.created_at).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`
  },
  { key: "days", header: getLabelByKey("days"), render: (sim: SimulationHistory) => sim.days },
  { key: "n", header: getLabelByKey("N"), render: (sim: SimulationHistory) => sim.n },
  { key: "final_susceptible", header: getLabelByKey("final_susceptible"), render: (sim: SimulationHistory) => sim.final_susceptible },
  { key: "final_recovered", header: getLabelByKey("final_recovered"), render: (sim: SimulationHistory) => sim.final_recovered },
  { key: "max_infected", header: getLabelByKey("max_infected"), render: (sim: SimulationHistory) => sim.max_infected.toFixed(2) },
  { key: "peak_day", header: getLabelByKey("peak_day"), render: (sim: SimulationHistory) => sim.peak_day },
  { key: "r0", header: getLabelByKey("r0"), render: (sim: SimulationHistory) => sim.r0.toFixed(2) },
  { key: "hit", header: getLabelByKey("hit"), render: (sim: SimulationHistory) => sim.hit.toFixed(2) },
];
