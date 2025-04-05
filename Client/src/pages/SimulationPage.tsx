import { Box, Heading, SimpleGrid, Tabs } from "@chakra-ui/react";
import SimulationForm from "../components/SimulationForm";
import SimulationChart, { SimulationModelResult } from "../components/SimulationChart";
import SimulationStats from "../components/SimulationStats";
import { useRef, useState } from "react";
import SimulationChartLegend from "../components/SimulationChartLegend";
import { SimulationFormValues } from "../models/simulation";
import AgentSimulationBox from "../components/AgentSimulationBox";
import FullScreenDialog from "../components/core/FullScreenDialog";
import PDFReportGenerator from "../components/PdfReport/PdfReportGenerator";

const SimulationPage = () => {
  const [data, setData] = useState<SimulationModelResult & { beta?: number; gamma?: number } | null>(null);
  const [modelParams, setModelParams] = useState<SimulationFormValues | null>(null);
  const simulationChartRef = useRef(null);

  const handleFormSubmit = (formData: SimulationFormValues, simulationData: SimulationModelResult & { beta?: number; gamma?: number } | null) => {
    setData(simulationData);
    setModelParams(formData);
  };

  return (
    <>
      <Heading size="3xl" mb={6}>SIR Симуляція</Heading>

      <SimpleGrid columns={{ base: 1, md: 9 }} gap={10}>
        <Box p={4} borderRadius="lg" boxShadow="md" gridColumn={{ md: "span 4" }} height="fit-content">
          <SimulationForm setData={handleFormSubmit} />
        </Box>

        {data && (
          <Box p={4} borderRadius="lg" boxShadow="md" gridColumn={{ md: "span 5" }}>
            <Tabs.Root defaultValue="chart" variant="outline">
              <div style={{ display: "flex" }}>
                <Tabs.List>
                  <Tabs.Trigger value="chart">
                    Графік та статистика
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.List>
                  <Tabs.Trigger value="agents">
                    Симуляція агентів
                  </Tabs.Trigger>
                </Tabs.List>
              </div>
              <Tabs.Content value="chart">
                <FullScreenDialog title="Графік" badgeInfo={`${modelParams?.model[0].toUpperCase()} модель`}>
                  <SimulationChart {...data} />
                  <SimpleGrid columns={{ base: 3, smDown: 1 }} gap={5}>
                    <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
                      <SimulationStats data={data} />
                    </Box>
                    <SimulationChartLegend {...data} />
                  </SimpleGrid>
                </FullScreenDialog>

                <div ref={simulationChartRef}>
                  <SimulationChart {...data} />
                </div>
                <SimpleGrid columns={{ base: 3, smDown: 1 }} gap={5}>
                  <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
                    <SimulationStats data={data} />
                  </Box>
                  <Box>
                    <SimulationChartLegend {...data} />
                    {simulationChartRef && data && modelParams && (
                      <div style={{ marginTop: "10px" }}>
                        <PDFReportGenerator
                          simulationData={data}
                          modelParams={modelParams}
                          chartRef={simulationChartRef}
                        />
                      </div>
                    )}
                  </Box>
                </SimpleGrid>
              </Tabs.Content>
              <Tabs.Content value="agents">
                {modelParams && (
                  <AgentSimulationBox modelParams={modelParams} />
                )}
              </Tabs.Content>
            </Tabs.Root>

          </Box>
        )}
      </SimpleGrid>
    </>
  );
};

export default SimulationPage;
