import { useEffect, useState } from "react";
import { Box, Heading, Table, Spinner, VStack, Tag, IconButton, HStack } from "@chakra-ui/react";
import { useApi } from "../../api/ApiProvider";
import { modelParameters, SimulationForComparison } from "../../models/simulation";
import { LuFileChartColumn } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const SimulationComparison = () => {
  const { api } = useApi();
  const navigate = useNavigate();
  const simulationIds = new URLSearchParams(location.search).get("ids")?.split(",") || [];
  const [simulations, setSimulations] = useState<SimulationForComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const activeParameters = modelParameters.filter(param =>
    simulations.some(sim => sim[param.key as keyof SimulationForComparison] !== null
      && sim[param.key as keyof SimulationForComparison] !== undefined)
  );

  useEffect(() => {
    const fetchSimulations = async () => {
      setLoading(true);
      const res = await api.post("/simulation/compare", { simulation_ids: simulationIds });
      const sims = res.data.simulations;
      setSimulations(sims);
      setLoading(false);
    };

    if (simulationIds.length > 0) {
      fetchSimulations();
    }
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <VStack align="stretch">
      <Heading size="3xl" mb={6}>SIR Симуляція</Heading>

      <Box w="full" overflowX="auto" borderWidth="1px" borderRadius="lg">
        <Table.Root variant="line" fontSize="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Параметр</Table.ColumnHeader>
              {simulations.map(sim => (
                <Table.ColumnHeader key={sim.id}>
                  <HStack gap={2}>
                    <Tag.Root colorPalette="purple" size="xl" >
                      <Tag.Label>{sim.model.toUpperCase()} </Tag.Label>
                    </Tag.Root>
                    <IconButton
                      colorPalette="purple"
                      aria-label="Переглянути"
                      variant="ghost"
                      onClick={() => navigate(`/?id=${sim.id}`)}
                    >
                      <LuFileChartColumn />
                    </IconButton>
                  </HStack>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {activeParameters.map(param => (
              <Table.Row key={param.key}>
                <Table.Cell fontWeight="bold">{param.label}</Table.Cell>
                {simulations.map(sim => {
                  const value = sim[param.key as keyof SimulationForComparison];
                  const formatted = param.key === "created_at"
                    ? new Date(value as string).toLocaleString("uk-UA", { hour12: false })
                    : value ?? "–";

                  return <Table.Cell key={sim.id}>{formatted}</Table.Cell>;
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  );
};

export default SimulationComparison;
