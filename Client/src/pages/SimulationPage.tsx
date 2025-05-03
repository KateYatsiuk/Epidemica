import { Alert, Box, Button, Heading, SimpleGrid, Tabs } from "@chakra-ui/react";
import SimulationForm from "../components/SimulationForms/SimulationForm";
import SimulationChart, { SimulationModelResult } from "../components/SimulationChart";
import SimulationStats from "../components/SimulationStats";
import { useEffect, useRef, useState } from "react";
import SimulationChartLegend from "../components/SimulationChartLegend";
import { ModelKind, SimulationFormValues } from "../models/simulation";
import AgentSimulationBox from "../components/AgentSimulationBox";
import FullScreenDialog from "../components/core/FullScreenDialog";
import PDFReportGenerator from "../components/PdfReport/PdfReportGenerator";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../api/ApiProvider";

enum TabsValues {
  Chart = "Chart",
  Agents = "Agents"
};

const SimulationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const simId = searchParams.get("id");
  const { api } = useApi();
  const [data, setData] = useState<SimulationModelResult | null>(null);
  const [modelParams, setModelParams] = useState<SimulationFormValues | null | undefined>(undefined);
  const simulationChartRef = useRef(null);
  const [activeTab, setActiveTab] = useState<string>(TabsValues.Chart);

  useEffect(() => {
    const fetchSimById = async () => {
      if (!simId) {
        setModelParams(null);
        return;
      }

      const res = await api.get(`/simulation/${simId}`);
      const simulation = res.data;

      const formValues: SimulationFormValues = {
        model: [simulation.model as ModelKind],
        initialS: simulation.initialS,
        initialI: simulation.initialI,
        beta: simulation.beta,
        gamma: simulation.gamma,
        n: simulation.N,
        days: simulation.days,
        sigma: simulation.sigma,
        delta: simulation.delta,
        vRate: simulation.vRate,
        hRate: simulation.hRate,
        mu: simulation.mu,
      };

      const resultParams: SimulationModelResult = {
        time: [], S: [], I: [], R: [],
        final_recovered: simulation.final_recovered,
        final_susceptible: simulation.final_susceptible,
        max_infected: simulation.max_infected,
        peak_day: simulation.peak_day,
        r0: simulation.r0
      };

      setModelParams(formValues);
      setData(resultParams);
    };

    fetchSimById();
  }, [simId]);

  const handleFormSubmit = (formData: SimulationFormValues, simulationData: SimulationModelResult | null) => {
    if (simId) {
      setData(prevData => {
        if (!prevData) return simulationData as SimulationModelResult;

        return {
          ...prevData,
          ...simulationData,
        } as SimulationModelResult;
      });
    } else {
      setData(simulationData);
    }
    setModelParams(formData);
  };

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Heading size="3xl" mb={2}>SIR Симуляція</Heading>
        {simId && (
          <Alert.Root
            status="info"
            title="У режимі перегляду існуючої симуляції поля недоступні для редагуванння"
            width="fit-content"
            colorPalette="purple"
            p={2}
            alignItems="center"
          >
            <Alert.Indicator />
            <Alert.Title>У режимі перегляду існуючої симуляції поля недоступні для редагуванння</Alert.Title>
            <Alert.Content>
              <Button colorPalette="purple" size="2xs" padding={15} onClick={() => navigate("/")}>
                Створити нову
              </Button>
            </Alert.Content>
          </Alert.Root>
        )}
      </div>
      <SimpleGrid columns={{ base: 1, xl: 9 }} gap={10}>
        {modelParams !== undefined ? (
          <Box p={4} borderRadius="lg" boxShadow="md" gridColumn={{ xl: "span 4" }} height="fit-content">
            <SimulationForm setData={handleFormSubmit} defaultValues={simId && modelParams ? modelParams : undefined} />
          </Box>
        ) : null}
        {data && data.S.length > 0 && (
          <Box p={4} borderRadius="lg" boxShadow="md" gridColumn={{ xl: "span 5" }}>
            <Tabs.Root
              defaultValue={TabsValues.Chart}
              variant="outline"
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value)}
            >
              <div style={{ display: "flex" }}>
                <Tabs.List>
                  <Tabs.Trigger value={TabsValues.Chart}>
                    Графік та статистика
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.List>
                  <Tabs.Trigger value={TabsValues.Agents}>
                    Симуляція агентів
                  </Tabs.Trigger>
                </Tabs.List>
              </div>
              <Tabs.Content value={TabsValues.Chart}>
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
              <Tabs.Content value={TabsValues.Agents}
                style={{
                  display: "grid", gap: "10px",
                  justifyContent: "center"
                }}
              >
                {modelParams && (
                  <AgentSimulationBox modelParams={modelParams} isActive={activeTab === TabsValues.Agents} />
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
