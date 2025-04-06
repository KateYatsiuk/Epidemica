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

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({});
  const onSubmit = handleSubmit((data) => console.log(data))

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
        <Heading size="3xl" mb={6}>Вхід</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={onSubmit} noValidate>
            <Stack p="1rem" gap={5}>
              <Field label="E-mail" invalid={!!errors.email} required errorText={errors.email?.message}>
                <Input
                  {...register("email", emailValidation)}
                  fontSize="md"
                  type="email"
                  required
                />
              </Field>

              <Field label="Пароль" invalid={!!errors.password} required errorText={errors.password?.message}>
                <PasswordInput
                  {...register("password", passwordValidation)}
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
                Увійти
              </Button>
            </Stack>
          </form>
        </Box>
        <Box>
          Немає облікового запису?{" "}
          <Link colorPalette="purple" href="/register" fontWeight="bold">
            Зареєструватись
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginForm;
