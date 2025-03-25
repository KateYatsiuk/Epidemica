import React from "react";
import InputField from "./core/InputField";
import { Control, UseFormWatch } from "react-hook-form";
import { ModelKind } from "../models/simulation";

interface ModelSpecificFieldsProps {
  control: Control<any, any>;
  watch: UseFormWatch<any>;
}

const ModelSpecificFields: React.FC<ModelSpecificFieldsProps> = ({ control, watch }) => {
  const selectedModel = watch("model")[0];

  return (
    <>
      {[ModelKind.SEIR, ModelKind.SEIHR, ModelKind.SEIQR, ModelKind.SEIRV].includes(selectedModel) && (
        <InputField name="sigma" label="Інкубаційний період (sigma)" control={control} type="number" step={0.01} /> 
      )}

      {selectedModel === ModelKind.SEIQR && (
        <InputField name="delta" label="Швидкість карантину (delta)" control={control} type="number" step={0.01} />
      )}

      {selectedModel === ModelKind.SEIRV && (
        <InputField name="vRate" label="Вакцинація (vRate)" control={control} type="number" step={0.01} />
      )}

      {selectedModel === ModelKind.SEIHR && (
        <>
          <InputField name="hRate" label="Госпіталізація (hRate)" control={control} type="number" step={0.01} />
          <InputField name="mu" label="Одужання з лікарні (mu)" control={control} type="number" step={0.01} />
        </>
      )}

      {selectedModel === ModelKind.SIR_DIFFUSION && (
        <InputField name="D" label="Дифузія (D)" control={control} type="number" step={0.01} />
      )}
    </>
  );
};

export default ModelSpecificFields;
