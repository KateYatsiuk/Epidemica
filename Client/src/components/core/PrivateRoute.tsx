import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useApi } from '../../api/ApiProvider';

export function PrivateRoute() {
  const { api } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/auth/whoami", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user_details);
      setLoading(false);
    } catch {
      setLoading(false);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="lg" colorPalette="purple" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}