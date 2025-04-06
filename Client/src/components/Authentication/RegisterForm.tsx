import {
  Flex,
  Heading,
  Button,
  Stack,
  Box,
  Link,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../ui/password-input";
import { Field } from "../ui/field";
import { emailValidation, passwordValidation } from "./authValidationRules";

interface RegisterFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({});
  const onSubmit = handleSubmit((data) => console.log(data))
  const password = watch("password");

  return (
    <Flex
      flexDirection="column"
      height="80vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb={2}
        p={5}
        justifyContent="center"
        alignItems="center"
        backgroundColor={{ base: "gray.100", _dark: "gray.900" }}
        borderRadius="lg"
      >
        <Heading size="3xl" mb={6}>Реєстрація</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={onSubmit} noValidate>
            <Stack p="1rem" gap={5}>
              <Field
                label="E-mail"
                invalid={!!errors.email}
                required
                errorText={errors.email?.message}
              >
                <Input
                  {...register("email", emailValidation)}
                  fontSize="md"
                  type="email"
                  required
                />
              </Field>

              <Field
                label="Пароль"
                invalid={!!errors.password}
                required
                errorText={errors.password?.message}
              >
                <PasswordInput
                  {...register("password", passwordValidation)}
                  fontSize="md"
                />
              </Field>
              <Field
                label="Повторіть пароль"
                invalid={!!errors.repeatPassword}
                required
                errorText={errors.repeatPassword?.message}
              >
                <PasswordInput
                  {...register("repeatPassword", {
                    required: "Повторіть пароль",
                    validate: (value) =>
                      value === password || "Паролі не співпадають",
                  })}
                  fontSize="md"
                />
              </Field>
              <Button
                type="submit"
                variant="solid"
                colorPalette="purple"
                width="full"
                mt={5}
              >
                Зареєструватись
              </Button>
            </Stack>
          </form>
        </Box>
        <Box>
          Вже маєте обліковий запис?{" "}
          <Link colorPalette="purple" href="/login" fontWeight="bold">
            Увійти
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default RegisterForm;
