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
  D?: number;
}

export enum ModelKind {
  SIR = "sir",
  SEIR = "seir",
  SEIQR = "seiqr",
  SEIRV = "seirv",
  SEIHR = "seihr",
  SIR_DIFFUSION = "sir_diffusion",
}

export const models = createListCollection({
  items: [
    { label: "SIR", value: ModelKind.SIR },
    { label: "SEIR", value: ModelKind.SEIR },
    { label: "SEIQR", value: ModelKind.SEIQR },
    { label: "SEIRV", value: ModelKind.SEIRV },
    { label: "SEIHR", value: ModelKind.SEIHR },
    { label: "SIR (з дифузією)", value: ModelKind.SIR_DIFFUSION },
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
  max_infected: number;
  peak_day: number;
};

export interface SimulationForComparison {
  id: string;
  model: string;
  created_at: string;
  days: number;
  max_infected: number;
  peak_day: number;
  final_susceptible: number;
  final_recovered: number;
  curve: { day: number; infected: number }[];
};
