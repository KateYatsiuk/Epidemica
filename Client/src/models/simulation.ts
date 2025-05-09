import { createListCollection } from "@chakra-ui/react";
import { AgentsStatesKind } from "./agent";

export interface SimulationFormValues {
  model: ModelKind[];
  initialS: number;
  initialI: number;
  beta: number;
  gamma: number;
  n: number;
  days: number;
  sigma?: number;
  delta?: number;
  vRate?: number;
  hRate?: number;
  mu?: number;
}

export enum ModelKind {
  SIR = "sir",
  SEIR = "seir",
  SEIQR = "seiqr",
  SEIRV = "seirv",
  SEIHR = "seihr",
}

export const models = createListCollection({
  items: [
    { label: "SIR", value: ModelKind.SIR },
    { label: "SEIR", value: ModelKind.SEIR },
    { label: "SEIQR", value: ModelKind.SEIQR },
    { label: "SEIRV", value: ModelKind.SEIRV },
    { label: "SEIHR", value: ModelKind.SEIHR },
  ],
})


interface LineConfig {
  color: string;
  label: string;
};

export const stateColors: Record<AgentsStatesKind, string> = {
  [AgentsStatesKind.Susceptible]: "blue",
  [AgentsStatesKind.Exposed]: "orange",
  [AgentsStatesKind.Infected]: "red",
  [AgentsStatesKind.Recovered]: "green",
  [AgentsStatesKind.Quarantined]: "purple",
  [AgentsStatesKind.Hospitalized]: "brown",
  [AgentsStatesKind.Vaccinated]: "cyan",
};

export const dataKeyColors: Record<string, LineConfig> = {
  S: { color: stateColors[AgentsStatesKind.Susceptible], label: "Сприйнятливі" },
  I: { color: stateColors[AgentsStatesKind.Infected], label: "Інфіковані" },
  R: { color: stateColors[AgentsStatesKind.Recovered], label: "Одужалі" },
  E: { color: stateColors[AgentsStatesKind.Exposed], label: "Латентно інфіковані" },
  Q: { color: stateColors[AgentsStatesKind.Quarantined], label: "У карантині" },
  H: { color: stateColors[AgentsStatesKind.Hospitalized], label: "Госпіталізовані" },
  V: { color: stateColors[AgentsStatesKind.Vaccinated], label: "Вакциновані" },
};

export const modelFieldMap: Record<ModelKind, (keyof SimulationFormValues)[]> = {
  [ModelKind.SIR]: ["model", "beta", "gamma", "days", "n", "initialS", "initialI"],
  [ModelKind.SEIR]: ["model", "beta", "gamma", "sigma", "days", "n", "initialS", "initialI"],
  [ModelKind.SEIQR]: ["model", "beta", "gamma", "sigma", "delta", "days", "n", "initialS", "initialI"],
  [ModelKind.SEIHR]: ["model", "beta", "gamma", "sigma", "hRate", "mu", "days", "n", "initialS", "initialI"],
  [ModelKind.SEIRV]: ["model", "beta", "gamma", "sigma", "vRate", "days", "n", "initialS", "initialI"],
};

export interface SimulationHistory {
  id: string;
  model: string;
  created_at: string;
  days: number;
  n: number;
  final_susceptible: number;
  final_recovered: number;
  max_infected: number;
  peak_day: number;
  r0: number;
};

export interface SimulationForComparison {
  id: string;
  model: string;
  created_at: string;
  days: number;
  initialS: number;
  initialI: number;
  beta: number;
  gamma: number;
  n: number;
  max_infected: number;
  peak_day: number;
  final_susceptible: number;
  final_recovered: number;
  r0: number;
  sigma?: number;
  delta?: number;
  v_rate?: number;
  h_rate?: number;
  mu?: number;
};

export const modelParameters = [
  { key: "created_at", label: "Дата" },
  { key: "days", label: "Кількість днів" },
  { key: "N", label: "Розмір популяції" },
  { key: "beta", label: "Коефіцієнт зараження (β)" },
  { key: "gamma", label: "Коефіцієнт одужання (γ)" },
  { key: "initialS", label: "Початково сприйнятливих (S)" },
  { key: "initialI", label: "Початково інфікованих (I)" },
  { key: "sigma", label: "Коефіцієнт інкубації (σ)" },
  { key: "delta", label: "Коефіцієнт карантину (δ)" },
  { key: "v_rate", label: "Коефіцієнт вакцинації" },
  { key: "h_rate", label: "Коефіцієнт госпіталізації" },
  { key: "mu", label: "Коефіцієнт одужання з лікарні (μ)" },
  { key: "max_infected", label: "Пік інфікованих" },
  { key: "peak_day", label: "День піку" },
  { key: "final_susceptible", label: "Кінцевих S" },
  { key: "final_recovered", label: "Кінцевих R" },
  { key: "r0", label: "Базове репродуктивне число (R₀)" },
];

export const getLabelByKey = (key: string) => {
  const param = modelParameters.find((param) => param.key === key);
  return param ? param.label : key;
};
