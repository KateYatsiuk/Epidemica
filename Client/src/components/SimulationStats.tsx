import { DataList, SimpleGrid } from "@chakra-ui/react";
import { SimulationModelResult } from "./SimulationChart";
import React from "react";
import { InfoTip } from "./ui/toggle-tip";

interface SimulationStatsProps {
  data: SimulationModelResult & { beta?: number; gamma?: number };
}

const SimulationStats = ({ data }: SimulationStatsProps) => {
  const stats = [
    { 
      label: "Базове репродуктивне число (R0)",
      value: (data.beta && data.gamma) ? (data.beta / data.gamma).toFixed(4) : "N/A",
      tooltip: "Середня кількість індивідуумів, яких інфікує один інфікований індивід, якщо всі інші в популяції сприйнятливі."
    },
    {
      label: "День піку інфікованих",
      value: data.peak_day.toString()
    },
    {
      label: "Максимальна кількість інфікованих",
      value: data.max_infected.toFixed(4)
    },
    {
      label: "Кінцева кількість сприйнятливих",
      value: data.final_susceptible.toFixed(4)
    },
    {
      label: "Кінцева кількість одужалих",
      value: data.final_recovered.toFixed(4)
    },
  ];

  return (
    <DataList.Root orientation="vertical" maxW="md" mt={4}>
      <SimpleGrid columns={2} gap={2}>
        {stats.map((item) => (
          <React.Fragment key={item.label}>
            <DataList.Item fontSize="md">
              <DataList.ItemLabel fontWeight={600} display="inline">
                {item.label}
                {item.tooltip && <InfoTip content={item.tooltip} />}
              </DataList.ItemLabel>
            </DataList.Item>
            <DataList.Item fontSize="md">
              <DataList.ItemValue>{item.value}</DataList.ItemValue>
            </DataList.Item>
          </React.Fragment>
        ))}
      </SimpleGrid>
    </DataList.Root>
  );
};

export default SimulationStats;
