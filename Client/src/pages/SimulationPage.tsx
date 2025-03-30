import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";
import SimulationForm from "../components/SimulationForm";
import SimulationChart, { SimulationModelResult } from "../components/SimulationChart";
import SimulationStats from "../components/SimulationStats";
import { useState } from "react";
import SimulationChartLegend from "../components/SimulationChartLegend";
import { SimulationFormValues } from "../models/simulation";
import AgentSimulationBox from "../components/AgentSimulationBox";
import FullScreenDialog from "../components/core/FullScreenDialog";
import { LiaFileDownloadSolid } from "react-icons/lia";

interface ReportData {
  model: string;
  params: {
    beta: number;
    gamma: number;
    days: number;
    n: number;
    initialS: number;
    initialI: number;
  };
  stats: {
    r0: number | undefined;
    max_infected: number;
    peak_day: number;
    final_susceptible: number;
    final_recovered: number;
  };
}

const SimulationPage = () => {
  const [data, setData] = useState<SimulationModelResult & { beta?: number; gamma?: number } | null>(null);
  const [modelParams, setModelParams] = useState<SimulationFormValues | null>(null);

  const handleFormSubmit = (formData: SimulationFormValues, simulationData: SimulationModelResult & { beta?: number; gamma?: number } | null) => {
    setData(simulationData);
    setModelParams(formData);
  };

  // TODO: FINISH
  const downloadReport = async () => {
    if (!modelParams || !data) return;
  
    const reportData: ReportData = {
      model: modelParams.model[0],
      params: {
        beta: modelParams.beta,
        gamma: modelParams.gamma,
        days: modelParams.days,
        n: modelParams.n,
        initialS: modelParams.initialS,
        initialI: modelParams.initialI,
      },
      stats: {
        r0: (data.beta && data.gamma) ? (data.beta / data.gamma) : undefined,
        max_infected: data.max_infected,
        peak_day: data.peak_day,
        final_susceptible: data.final_susceptible,
        final_recovered: data.final_recovered,
      }
    };
  
    const response = await fetch("http://127.0.0.1:5000/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    });
  
    if (!response.ok) {
      alert("Помилка при генерації PDF!");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulation_report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
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
            <FullScreenDialog title="Графік" badgeInfo={`${modelParams?.model[0].toUpperCase()} модель`}>
              <SimulationChart {...data} />
              <SimpleGrid columns={{ base: 3, smDown: 1 }} gap={5}>
                <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
                  <SimulationStats data={data} />
                </Box>
                <SimulationChartLegend {...data} />
              </SimpleGrid>
            </FullScreenDialog>

            <SimulationChart {...data} />
            <SimpleGrid columns={{ base: 3, smDown: 1 }} gap={5}>
              <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
                <SimulationStats data={data} />
              </Box>
              <Box>
                <SimulationChartLegend {...data} />
                <Button colorPalette="purple" minWidth="fit-content" onClick={downloadReport}>
                  <LiaFileDownloadSolid /> Скачати звіт
                </Button>
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </SimpleGrid>

      {modelParams && (
        <Box p={4} mt={10} borderRadius="lg" boxShadow="md">
          <AgentSimulationBox modelParams={modelParams} />
        </Box>
      )}
    </>
  );
};

export default SimulationPage;
