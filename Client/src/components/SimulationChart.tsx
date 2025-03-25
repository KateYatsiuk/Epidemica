import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { dataKeyColors } from "../models/simulation";

export interface SimulationModelResult {
  time: number[];
  S: number[];
  I: number[];
  R: number[];
  E?: number[];
  Q?: number[];
  H?: number[];
  V?: number[];
  final_recovered: number;
  final_susceptible: number;
  max_infected: number;
  peak_day: number;
}

function SimulationChart({ time, S, I, R, E, Q, H, V }: Partial<SimulationModelResult>) {
  const chartData = time?.map((_, i) => ({
    day: i,
    S: S?.[i],
    I: I?.[i],
    R: R?.[i],
    E: E ? E[i] : undefined,
    Q: Q ? Q[i] : undefined,
    H: H ? H[i] : undefined,
    V: V ? V[i] : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(dataKeyColors).map((key) => {
        const { color } = dataKeyColors[key];
        const condition = eval(key);
        return (
          condition && (
            <Line key={key} type="monotone" dataKey={key} stroke={color} />
          )
        );
      })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SimulationChart;
