import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import NavBar from "./components/core/NavBar";
import SimulationPage from "./pages/SimulationPage";
import SimulationComparison from "./components/History/SimulationComparison";
import LoginForm from "./components/Authentication/LoginForm";
import RegisterForm from "./components/Authentication/RegisterForm";
import HistoryPage from "./pages/HistoryPage";
import { useEffect, useState } from "react";
import { useApi } from "./api/ApiProvider";
import { PrivateRoute } from "./components/core/PrivateRoute";

function App() {
  const { api } = useApi();
  const [user, setUser] = useState<{ email: string } | null>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await api.get("/auth/whoami", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user_details);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Box p={5}>
        <Router>
          <Routes>
            <Route path='/' element={<PrivateRoute />}>
              <Route index path={"/"} element={<SimulationPage />} />
              <Route index path={"/history"} element={<HistoryPage />} />
              <Route index path={"/compare"} element={<SimulationComparison />} />
            </Route>
            <Route path={"/login"} Component={() => <LoginForm setUser={setUser} />} />
            <Route path={"/register"} Component={() => <RegisterForm setUser={setUser} />} />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
