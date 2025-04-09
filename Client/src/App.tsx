import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import NavBar from "./components/core/NavBar";
import SimulationPage from "./pages/SimulationPage";
import SimulationComparison from "./components/History/SimulationComparison";
import LoginForm from "./components/Authentication/LoginForm";
import RegisterForm from "./components/Authentication/RegisterForm";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <>
      <NavBar />
      <Box p={5}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<SimulationPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/compare" element={<SimulationComparison />} />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
