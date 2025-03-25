import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Toaster, toaster } from '../components/ui/toaster';

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 30000,
});

const ApiContext = createContext<{ api: AxiosInstance }>({ api });

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const status = error.response?.status;

        if (status) {
          let errorMessage = "Щось пішло не так 😞";

          switch (status) {
            // case 400:
            //   errorMessage = "❌ Некоректний запит";
            //   break;
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
            description: errorMessage,
            duration: 5000,
            type: "error"
          });
        } else if (error.request) {
          toaster.create({
            title: "Немає зв'язку",
            description: "Сервер не відповідає. Перевірте підключення до інтернету",
            duration: 5000,
            type: "error"
          });
        } else {
          toaster.create({
            title: "Помилка",
            description: error.message || "Сталася помилка при надсиланні запиту",
            duration: 5000,
            type: "error"
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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
