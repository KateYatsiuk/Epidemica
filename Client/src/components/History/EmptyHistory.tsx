import { Button, EmptyState, VStack } from "@chakra-ui/react"
import { HiColorSwatch } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

const EmptyHistory = () => {
  const navigate = useNavigate();

  return (
    <EmptyState.Root size="lg">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <HiColorSwatch />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title fontSize="xl">Історія симуляцій порожня</EmptyState.Title>
          <EmptyState.Description fontSize="lg">
            Перейдіть на сторінку Симуляція, щоб створити симуляцію
          </EmptyState.Description>
        </VStack>
        <Button colorPalette="purple" size="lg" onClick={() => navigate("/")}>
          Перейти на сторінку симуляції
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}

export default EmptyHistory;
