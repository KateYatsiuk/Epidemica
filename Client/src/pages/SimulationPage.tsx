import { Box, Flex, Heading } from "@chakra-ui/react";
import SimulationForm from "../components/SimulationForm";
import SimulationChart, { SimulationModelResult } from "../components/SimulationChart";
import SimulationStats from "../components/SimulationStats";
import { useState } from "react";
import SimulationChartLegend from "../components/SimulationChartLegend";
import { SimulationFormValues } from "../models/simulation";
import AgentSimulationBox from "../components/AgentSimulationBox";

const SimulationPage = () => {
  const [data, setData] = useState<SimulationModelResult & { beta?: number; gamma?: number } | null>(null);
  const [modelParams, setModelParams] = useState<SimulationFormValues | null>(null);

  const handleFormSubmit = (formData: SimulationFormValues, simulationData: SimulationModelResult & { beta?: number; gamma?: number } | null) => {
    setData(simulationData);
    setModelParams(formData);
  };

  return (
    <Box p={5}>
      <Heading size="3xl" mb={6}>SIR Симуляція</Heading>
      <Flex direction="row" gap={100}>
        <Box p={4} borderRadius="lg" boxShadow="md">
          <SimulationForm setData={handleFormSubmit} />
        </Box>

        {data &&
          <Box flex="1" p={4} borderRadius="lg" boxShadow="md" minWidth="800px">
            <SimulationChart {...data} />
            <Flex direction="row" gap={30}>
              <SimulationStats data={data} />
              <SimulationChartLegend {...data} />
            </Flex>
          </Box>
        }
      </Flex>
      {modelParams && (
        <Box p={4} mt={10} borderRadius="lg" boxShadow="md">
          <AgentSimulationBox modelParams={modelParams} />
        </Box>
      )}
    </Box>
  );
};

export default SimulationPage;
