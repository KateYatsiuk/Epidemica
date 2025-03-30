import { Box } from "@chakra-ui/react";
import NavBar from "./components/core/NavBar";
import SimulationPage from "./pages/SimulationPage";

function App() {
  return (
    <>
      <NavBar />
      <Box p={5}>
        <SimulationPage />
      </Box>
    </>
  );
}

export default App;
