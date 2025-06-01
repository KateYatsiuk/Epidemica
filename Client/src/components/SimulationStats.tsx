import { DataList, SimpleGrid } from "@chakra-ui/react";
import { SimulationModelResult } from "./SimulationChart";
import React from "react";
import { InfoTip } from "./ui/toggle-tip";
import { getLabelByKey } from "../models/simulation";

interface SimulationStatsProps {
  data: SimulationModelResult;
}

const SimulationStats = ({ data }: SimulationStatsProps) => {
  const stats = [
    {
      label: getLabelByKey("r0"),
      value: data.r0,
      tooltip: "Середня кількість індивідуумів, яких інфікує один інфікований індивід, якщо всі інші в популяції сприйнятливі."
    },
    {
      label: getLabelByKey("hit"),
      value: data.hit,
      tooltip: "Частка імунних осіб, необхідна в популяції, щоб популяція мала колективний імунітет"
    },
    {
      label: getLabelByKey("peak_day"),
      value: data.peak_day.toString()
    },
    {
      label: getLabelByKey("max_infected"),
      value: data.max_infected.toFixed(2)
    },
    {
      label: getLabelByKey("final_susceptible"),
      value: data.final_susceptible.toFixed(2)
    },
    {
      label: getLabelByKey("final_recovered"),
      value: data.final_recovered.toFixed(2)
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
