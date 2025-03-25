import { Input } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Controller } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  control: any;
  type: string;
  step?: number;
  helpText?: string;
  readonly?: boolean;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, control, type, step, helpText, readonly, required = false }) => {
  return (
    <Field label={label} helperText={helpText} required={required}>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Це поле обов'язкове" }}
        render={({ field, fieldState }) => (
          <Input {...field} type={type} step={step} disabled={readonly} fontSize="md" _invalid={fieldState.error ? { borderColor: "red.500" } : undefined} />
        )}
      />
    </Field>
  );
};

export default InputField;
