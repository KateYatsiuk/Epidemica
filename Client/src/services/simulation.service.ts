import { ModelKind, SimulationFormValues } from "../models/simulation";

export const prepareSimulationData = (formValues: SimulationFormValues): Record<string, number | string> => {
  const model = formValues.model[0];
  const params: Record<string, number | string> = {
    model: model,
    beta: formValues.beta,
    gamma: formValues.gamma,
    days: formValues.days,
    n: formValues.n,
    initialS: formValues.initialS,
    initialI: formValues.initialI,
  };

  if ([ModelKind.SEIR, ModelKind.SEIHR, ModelKind.SEIQR, ModelKind.SEIRV].includes(model)) params.sigma = formValues.sigma!;
  if (model === ModelKind.SEIQR) {
    params.delta = formValues.delta!;
    params.mu = formValues.mu!;
  }
  if (model === ModelKind.SEIRV) params.vRate = formValues.vRate!;
  if (model === ModelKind.SEIHR) {
    params.hRate = formValues.hRate!;
    params.mu = formValues.mu!;
  }
  return params;
};
