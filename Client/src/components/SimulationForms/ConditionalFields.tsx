import React from "react";
import InputField from "../core/InputField";
import { Control, UseFormWatch } from "react-hook-form";
import { ModelKind } from "../../models/simulation";

interface ModelSpecificFieldsProps {
  control: Control<any, any>;
  watch: UseFormWatch<any>;
  allReadonly: boolean;
}

const ModelSpecificFields: React.FC<ModelSpecificFieldsProps> = ({ control, watch, allReadonly }) => {
  const selectedModel = watch("model")[0];
  const STEP = 0.01;

  return (
    <>
      {[ModelKind.SEIR, ModelKind.SEIHR, ModelKind.SEIQR, ModelKind.SEIRV].includes(selectedModel) && (
        <InputField name="sigma" label="Інкубаційний період (sigma)" control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIQR && (
        <InputField name="delta" label="Швидкість карантину (delta)" control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIRV && (
        <InputField name="vRate" label="Вакцинація (vRate)" control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIHR && (
        <>
          <InputField name="hRate" label="Госпіталізація (hRate)" control={control} type="number" step={STEP} required readonly={allReadonly} />
          <InputField name="mu" label="Одужання з лікарні (mu)" control={control} type="number" step={STEP} required readonly={allReadonly} />
        </>
      )}

      {/* {selectedModel === ModelKind.SIR_DIFFUSION && (
        <InputField name="D" label="Дифузія (D)" control={control} type="number" step={STEP} required readonly={allReadonly} />
      )} */}
    </>
  );
};

export default ModelSpecificFields;
