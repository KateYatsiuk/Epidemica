import React, { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { modelFieldMap, ModelKind, models, SimulationFormValues } from "../../models/simulation";
import {
  Button,
  Flex,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import { prepareSimulationData } from "../../services/simulation.service";
import { Field } from "../ui/field";
import InputField from "../core/InputField";
import ConditionalFields from "./ConditionalFields";
import { useApi } from "../../api/ApiProvider";

interface SimulationFormProps {
  setData: (formData: SimulationFormValues, simulationData: any) => void;
  defaultValues?: SimulationFormValues;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ setData, defaultValues }) => {
  const { api } = useApi();
  const { control, handleSubmit, watch, setValue } = useForm<SimulationFormValues>({
    defaultValues: defaultValues ?? {
      model: [ModelKind.SIR],
      beta: 0.3,
      gamma: 0.1,
      sigma: 0.2,
      delta: 0.1,
      vRate: 0.05,
      hRate: 0.05,
      mu: 0.02,
      D: 0.01,
      days: 100,
      n: 100,
      initialS: 99,
      initialI: 1,
    },
  });

  const n = useWatch({ control, name: "n" });
  const initialS = useWatch({ control, name: "initialS" });
  const initialI = useWatch({ control, name: "initialI" });

  useEffect(() => {
    const total = Number(initialS) + Number(initialI);
    if (total !== n) {
      setValue("n", total);
    }
  }, [n, initialS, initialI, setValue]);

  useEffect(() => {
    const selectedModel = watch("model");
    const allowedFields = new Set(modelFieldMap[selectedModel[0]]);

    Object.keys(modelFieldMap).flat().forEach((field) => {
      if (!allowedFields.has(field as keyof SimulationFormValues)) {
        setValue(field as keyof SimulationFormValues, undefined);
      }
    });
  }, [watch("model")]);

  const filterFields = (data: SimulationFormValues) => {
    const selectedModel = data.model;
    const allowedFields = new Set(modelFieldMap[selectedModel[0]]);

    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.has(key as keyof SimulationFormValues))
    ) as SimulationFormValues;
  }

  const onSubmit = async (data: SimulationFormValues) => {
    const filteredData = filterFields(data);
    const body = prepareSimulationData(filteredData);

    try {
      if (defaultValues) {
        const response = await api.post('/simulation/view', body);
        setData(filteredData, { ...response.data });
      } else {
        const response = await api.post('/simulation', body);
        setData(filteredData, { ...response.data });
      }
    } catch (error) {
      console.error("Error getting simulation data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex alignItems="center" marginBottom={5}>
        <Field label="Модель">
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={models}
                bgColor={{ base: "gray.100", _dark: "gray.800" }}
                borderRadius="0.25rem"
                readOnly={!!defaultValues}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Оберіть модель" />
                </SelectTrigger>
                <SelectContent fontSize="md">
                  {models.items.map((model) => (
                    <SelectItem item={model} key={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>
      </Flex>
      <Stack gap={10}>
        <SimpleGrid columns={2} gap={5}>
          <InputField name="beta" label="Швидкість зараження (beta)" control={control} type="number" step={0.01} required readonly={!!defaultValues} />
          <InputField name="gamma" label="Швидкість одужання (gamma)" control={control} type="number" step={0.01} required readonly={!!defaultValues} />
          <InputField name="days" label="Кількість днів" control={control} type="number" required readonly={!!defaultValues} />
          <InputField name="n" label="Кількість людей" control={control} type="number" helpText="Кількість людей рівна S+I" required readonly />
          <InputField name="initialS" label="Початково сприйнятливі (S)" control={control} type="number" required readonly={!!defaultValues} />
          <InputField name="initialI" label="Початково інфіковані (I)" control={control} type="number" required readonly={!!defaultValues} />

          <ConditionalFields control={control} watch={watch} allReadonly={!!defaultValues} />
        </SimpleGrid>
        <Button colorPalette="purple" type="submit">Запустити симуляцію</Button>
      </Stack>
    </form>
  );
};

export default SimulationForm;
