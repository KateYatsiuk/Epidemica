import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode } from 'react';
import { Toaster, toaster } from '../components/ui/toaster';

interface RequestReponse {
  dataObj: any;
  message: string;
}

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 30000,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.get("http://127.0.0.1:5000/auth/refresh", {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        if (originalRequest?.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const status = error.response?.status;
    const message = (error.response?.data as RequestReponse).message;

    if (status && !message) {
      let errorMessage = "Щось пішло не так 😞";

      switch (status) {
        case 401:
          errorMessage = "🔑 Неавторизований доступ";
          break;
        case 403:
          errorMessage = "🚫 Доступ заборонено";
          break;
        case 404:
          errorMessage = "🔎 Ресурс не знайдено";
          break;
        case 500:
          errorMessage = "🔥 Внутрішня помилка сервера";
          break;
      }

      toaster.create({
        title: "Помилка",
        description: message || errorMessage,
        duration: 5000,
        type: "error",
      });
    } else if (error.request) {
      toaster.create({
        title: "Помилка",
        description: message || "Сталася помилка при запиті",
        duration: 5000,
        type: "error",
      });
    } else {
      toaster.create({
        title: "Немає зв'язку",
        description: "Сервер не відповідає. Перевірте інтернет",
        duration: 5000,
        type: "error",
      });
    }

    return Promise.reject(error);
  }
);

const ApiContext = createContext<{ api: AxiosInstance }>({ api });

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApiContext.Provider value={{ api }}>
      <>
        {children}
        <Toaster />
      </>
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
