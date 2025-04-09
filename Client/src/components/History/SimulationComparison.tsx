import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Spinner,
  VStack,
  Tag,
} from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useApi } from "../../api/ApiProvider";
import { SimulationForComparison } from "../../models/simulation";

const colors = ["#3182CE", "#38A169", "#D69E2E"];

const SimulationComparison = () => {
  const { api } = useApi();
  const simulationIds = new URLSearchParams(location.search).get("ids")?.split(",") || [];
  const [simulations, setSimulations] = useState<SimulationForComparison[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "model", header: "Модель", render: (sim: SimulationForComparison) => (
        <Tag.Root colorPalette="purple" size="xl">
          <Tag.Label>{sim.model.toUpperCase()}</Tag.Label>
        </Tag.Root>
      ),
    },
    {
      key: "created_at", header: "Дата", render: (sim: SimulationForComparison) =>
        `${new Date(sim.created_at).toLocaleDateString("uk-UA")}
          ${new Date(sim.created_at).toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`
    },
    { key: "days", header: "Днів", render: (sim: SimulationForComparison) => sim.days },
    { key: "max_infected", header: "Пік інфікованих", render: (sim: SimulationForComparison) => sim.max_infected.toFixed(2) },
    { key: "peak_day", header: "День піку", render: (sim: SimulationForComparison) => sim.peak_day },
    { key: "final_susceptible", header: "Кінцеві S", render: (sim: SimulationForComparison) => sim.final_susceptible },
    { key: "final_recovered", header: "Кінцеві R", render: (sim: SimulationForComparison) => sim.final_recovered },
  ];

  useEffect(() => {
    const fetchSimulations = async () => {
      setLoading(true);
      try {
        const res = await api.post("/compare", { simulation_ids: simulationIds });
        setSimulations(res.data.simulations);
        // setSimulations([
        //   {
        //     "id": "1",
        //     "model": "sir",
        //     "final_recovered": 93.93180682402061,
        //     "final_susceptible": 5.913073009531963,
        //     "max_infected": 30.362111721754705,
        //     "peak_day": 26,
        //     "curve": [
        //       { "day": 0, "infected": 1 },
        //       { "day": 1, "infected": 2.4 },
        //     ]
        //   },
        //   {
        //     "id": "2",
        //     "model": "seir",
        //     "final_recovered": 90.63428778590107,
        //     "final_susceptible": 6.527938695617963,
        //     "max_infected": 19.851888277078146,
        //     "peak_day": 55,
        //     "curve": [
        //       { "day": 0, "infected": 1 },
        //       { "day": 1, "infected": 2 },
        //     ]
        //   },
        // ]);
      } catch (err) {
        console.error("Failed to fetch simulation data", err);
      } finally {
        setLoading(false);
      }
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

      <Box w="full" overflowX="auto"  borderWidth="1px" borderRadius="lg">
        <Table.Root variant="line" fontSize="md">
          <Table.Header>
            <Table.Row>
              {columns.map(col => (
                <Table.ColumnHeader key={col.key}>{col.header}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {simulations.map((sim) => (
              <Table.Row key={sim.id}>
                {columns.map(col => (
                  <Table.Cell key={col.key}>{col.render(sim)}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* TODO: FINISH */}
      <Box borderWidth="1px" borderRadius="lg" mt={2}>
        <Heading size="2xl" mb={4}>Динаміка інфікованих</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            {simulations.map((sim, idx) => (
              <Line
                key={sim.id}
                data={sim.curve}
                type="monotone"
                dataKey="infected"
                name={sim.model}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </VStack>
  );
};

export default SimulationComparison;
