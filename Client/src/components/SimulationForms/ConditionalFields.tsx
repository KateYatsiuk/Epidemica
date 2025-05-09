import React from "react";
import InputField from "../core/InputField";
import { Control, UseFormWatch } from "react-hook-form";
import { getLabelByKey, ModelKind } from "../../models/simulation";

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
        <InputField name="sigma" label={getLabelByKey("sigma")} control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIQR && (
        <InputField name="delta" label={getLabelByKey("delta")} control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIRV && (
        <InputField name="vRate" label={getLabelByKey("v_rate")} control={control} type="number" step={STEP} required readonly={allReadonly} />
      )}

      {selectedModel === ModelKind.SEIHR && (
        <>
          <InputField name="hRate" label={getLabelByKey("h_rate")} control={control} type="number" step={STEP} required readonly={allReadonly} />
          <InputField name="mu" label={getLabelByKey("mu")} control={control} type="number" step={STEP} required readonly={allReadonly} />
        </>
      )}
    </>
  );
};

export default ModelSpecificFields;
