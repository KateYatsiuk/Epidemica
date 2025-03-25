import { Box, Flex, Text } from "@chakra-ui/react";
import { SimulationModelResult } from "./SimulationChart";
import { dataKeyColors } from "../models/simulation";


const SimulationChartLegend = ({ E, Q, H, V }: Partial<SimulationModelResult>) => {
  const conditions = { E, Q, H, V };

  const lineDescriptions = Object.keys(dataKeyColors)
    .map((key) => {
      const { color, label } = dataKeyColors[key];
      const condition = key === "S" || key === "I" || key === "R"
        ? true
        : conditions[key as keyof typeof conditions];

      return {
        label: key,
        color,
        description: label,
        condition,
      };
    })
    .filter(item => item.condition);

  return (
    <Box mt={4}>
      {lineDescriptions.map(({ label, color, description }) => (
        <Flex key={label} align="center">
          <Box width="20px" height="20px" bg={color} mr={2}></Box>
          <Text fontSize="md">
            <strong>{label} - </strong> {description}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default SimulationChartLegend;